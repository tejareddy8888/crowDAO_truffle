import React, { Component } from 'react';
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
//import { Button } from 'react-bootstrap';
import history from './history';

class ReviewProposal extends Component {

	state = { accounts: null , contract: null, storageValue: 0 };
	//state = { storageValue: 0, web3: null, accounts: null, contract: null };

	componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const account = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = CrowDAO.networks[networkId];
      const instance = new web3.eth.Contract(CrowDAO.abi, deployedNetwork && deployedNetwork.address);
      //console.log("instance:" + instance);
      this.setState({ accounts : account, contract: instance}, this.getBalance);
      if(account == "0x9a9FF10B5034348944bfc62fdFd2d7E7fa8A5a90"){this.loadReview();}
      else {alert("Not authorised to view the page");}
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    	}

      


  	};

    getBalance= async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getBalance(accounts[0]).call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

	loadReview= async () => {
    const { accounts, contract } = this.state;

    var passedResp;
      var fitresp;
      var i = 0;

      for(i=0;i<2;i++){
      await contract.methods.hasVotingPeriodExpired(i).call().then(function(response1){ passedResp = response1;});
      await contract.methods.getProposalByIndex(i).call().then(function(response){ fitresp = response;});
      if(passedResp == true & fitresp[5] == true & fitresp[3] > fitresp[4])
      {
      var newRow=document.getElementById('reviewTable').insertRow();
      // Insert a cell in the row at cell index 0
      var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(fitresp[0]));
      // Insert a cell in the row at cell index 1
      var cell2   = newRow.insertCell(1);

      cell2.appendChild(document.createTextNode(fitresp[1]));
      var cell3   = newRow.insertCell(2);
      cell3.appendChild(document.createTextNode(fitresp[2]));

      //Accept Proposal Button
      var cell4   = newRow.insertCell(3);
      var button = document.createElement('button');
      button.innerHTML = 'Accept Proposal';
      button.onclick = this.acceptProposal;
      button.id = "acceptProposalButton"+i;
      button.value = i;
      cell4.appendChild(button);
      if(fitresp[5] == true){document.getElementById("acceptProposalButton"+i).disabled = true;}


      }
        
    }
  };


  acceptProposal= async (event) => {
    const { accounts, contract } = this.state;
    var proposal_index = event.target.value;
    var checkPassRes;

    // Get the value from the contract to prove it worked.
    await contract.methods.getProposalByIndex(proposal_index).call().then(function(response){ checkPassRes = response;});
    if(checkPassRes[5] == false)
      {
        //console.log("Reached haya"+ checkPassRes[5]);
        await contract.methods.hasProposalPassed(proposal_index).send({from: accounts[0]});
      }
      else{
        alert(`Contract has been accepted already`);
      }
    document.getElementById("acceptProposalButton").disabled = true; 
  };


    render() { 
        return (
            <div>
            	<h1>Review Proposal</h1>
                <p>Your Special Account {this.state.accounts} have {this.state.storageValue} ETH balance</p>
                <div>
                <h3>Review the proposal with the following details</h3>
                </div>
                <div id= "container"> 
                	<table id="reviewTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">	
                	<tr> <th colspan="5"><h3>Review Proposal List</h3></th></tr>
                	<tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Accept the Proposal</th></tr>
                	</table>
                </div>
            </div>
        );
    }
}

export default ReviewProposal;