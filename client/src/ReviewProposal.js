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
      this.showReviewList();
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


showReviewList = async () => {
    const { accounts, contract } = this.state;
    //console.log("Contract in Function:"+ contract);
    

    var respo;
    var i;
    var propLength;

    await contract.methods.getProposalCount().call().then(function(response){ propLength = response;});
    
    //This loop only display the active proposals only.
    for(i=0;i<=propLength-1;i++){
      //await contract.methods.hasVotingPeriodExpired(i).call().then(function(response1){ passedResp = response1;});
      await contract.methods.getProposalByIndex(i).call().then(function(response){ respo = response;});
      //await contract.methods.hasProposalPassed(i).call().then(function(response){ passedResp = response;});
      //console.log(passedResp[0]);
      if(respo[5] == true & accounts == respo[6])
      {
      var newRow=document.getElementById('reviewTable').insertRow();
      var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(respo[0]));
      // Insert a cell in the row at cell index 1
      var cell2   = newRow.insertCell(1);

      cell2.appendChild(document.createTextNode(respo[1]));
      var cell3   = newRow.insertCell(2);
      cell3.appendChild(document.createTextNode(respo[2]));

      //Vote completed
      var cell4   = newRow.insertCell(3);
      var button = document.createElement('button');
      button.innerHTML = 'Completed';
      button.onclick = this.voteCompleted;
      //button.id = "yesbutton";
      button.value = i;
      cell4.appendChild(button);


      }
    }     
};
	


    render() { 
        return (
            <div>
            	<h1>Review Proposal</h1>
                <p>Your Account {this.state.accounts} have {this.state.storageValue} ETH balance</p>
                <div>
                <h3>Review your proposal with the following details</h3>
                </div>
                <div id= "container"> 
                	<table id="reviewTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">	
                	<tr> <th colspan="5"><h3>Review Proposal List</h3></th></tr>
                	<tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Proposal Completed</th></tr>
                	</table>
                </div>
            </div>
        );
    }
}

export default ReviewProposal;