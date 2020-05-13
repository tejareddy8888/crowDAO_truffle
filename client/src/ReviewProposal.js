import React, { Component } from 'react';
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
//import { Button } from 'react-bootstrap';
import history from './history';

class ReviewProposal extends Component {

	//state = { accounts: null , contract: null, storageValue: 0 };
	state = { storageValue: 0, web3: null, accounts: null, contract: null };

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
      var value = await instance.methods.getBalance(account[0]).call();
      value = web3.utils.fromWei(value, 'ether');
      this.setState({ web3:web3,accounts : account, contract: instance,storageValue: value});
      if(value > 1)
      {
      this.showReviewList();
      }
      else{
        alert(
         'Please load money in your account and come back'
        );
      }
      window.ethereum.on('accountsChanged', this.handleUpdate);  
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    	}
  	};


getBalance= async () => {
    const { web3,accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    var value = await contract.methods.getBalance(accounts[0]).call();
    value = web3.utils.fromWei(value, 'ether');
    // Update state with the result.
    this.setState({ storageValue: value });
  };

showReviewList = async () => {
    const { web3,accounts, contract } = this.state;
    //console.log("Contract in Function:"+ contract);

    var respo;
    var i;
    var propLength;
    var periodResp;
    var ProcResp;
    var Abortresp;

    await contract.methods.getProposalCount().call().then(function(response){ propLength = response;});
    
    //This loop only display the active proposals only.
    for(i=0;i<=propLength-1;i++){
      await contract.methods.hasVotingPeriodExpiredFinal(i).call().then(function(response){ periodResp = response;});
      console.log(" TimeExpired "+periodResp);
      await contract.methods.getProposalByIndex2(i).call().then(function(response){ respo = response;});
      console.log(" did Pass is "+respo[3]);
      await contract.methods.didProposalProcessed(i).call().then(function(response){ ProcResp = response;});
      await contract.methods.didProposalAborted(i).call().then(function(response){ Abortresp = response;});
      
      if(respo[3] == true & periodResp == false && ProcResp == true && Abortresp == false)
      {
      var newRow=document.getElementById('reviewTable').insertRow();
      var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(respo[0]));
      // Insert a cell in the row at cell index 1
      var cell2   = newRow.insertCell(1);

      cell2.appendChild(document.createTextNode(respo[1]));
      var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(respo[2], 'ether');
      cell3.appendChild(document.createTextNode(amount));

      //Vote completed
      var cell4   = newRow.insertCell(3);
      var button = document.createElement('button');
      button.innerHTML = 'Yes';
      button.onclick = this.voteAdd;
      //button.id = "yesbutton";
      button.value = respo[0];
      cell4.appendChild(button);

      //Vote Not completed
      var cell4   = newRow.insertCell(4);
      var button = document.createElement('button');
      button.innerHTML = 'No';
      button.onclick = this.voteAdd;
      //button.id = "yesbutton";
      button.value = respo[0];
      cell4.appendChild(button);


      }
      else if(respo[3] == true & periodResp == true && ProcResp == true && Abortresp == false && (respo[4] > respo[5]))
      {
        console.log(i)
      var newRow=document.getElementById('passTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		  cell1.appendChild(document.createTextNode(respo[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(respo[1]));
  		var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(respo[2], 'ether');
      cell3.appendChild(document.createTextNode(amount));


      }

      else if(respo[3] == true & periodResp == true && ProcResp == true && Abortresp == false && (respo[4] <= respo[5]))
      {
        var newRow=document.getElementById('failedTable').insertRow();
        var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(respo[0]));
      // Insert a cell in the row at cell index 1
        var cell2   = newRow.insertCell(1);
  
        cell2.appendChild(document.createTextNode(respo[1]));
        var cell3   = newRow.insertCell(2);
        var amount = web3.utils.fromWei(respo[2], 'ether');
        cell3.appendChild(document.createTextNode(amount));
  
      }
    }     
};
	
voteAdd = async (event) => {
    const { accounts, contract } = this.state;
    var vote_val;
    if(event.target.innerHTML == "Yes"){vote_val = 1;}
    else {vote_val = 2;}
    var proposal_index = event.target.value;
    console.log("Acounts :"+accounts[0]);
    console.log("This is for testing purpose only. "+ proposal_index+" : "+vote_val);
    console.log("contract.methods.submitPassedVote("+proposal_index+","+vote_val+")");
    await contract.methods.submitPassedVote(proposal_index, vote_val).send({from: accounts[0]});
  };


   
handleUpdate = async() =>{
  try{
    console.log("trying to update the Accounts");
    const web3 = await getWeb3();
    const accounts =  await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();

    console.log("Accounts are:"+ accounts);

    const deployedNetwork = CrowDAO.networks[networkId];
    const instance = new web3.eth.Contract(CrowDAO.abi, deployedNetwork && deployedNetwork.address);
    //console.log("instance:" + deployedNetwork.address);

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    this.setState({ web3, accounts, contract: instance }, this.getBalance);

    //console.log("Contracts:"+contract);
    this.props.history.push('/')
  } 
  
  catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }
};



    render() { 
        return (
            <div>
              <div class="center revprop-div">
                <div class="lead-text">Account : {this.state.accounts} </div>
                <div class="lead-text">Current balance : {this.state.storageValue} ether</div>
                <div>
                <small><b>Note: Review the proposal nd vote for the final confirmation of completion of the respective proposals.</b></small>
                </div>
              </div>
              <br/>
              <br/>
                <center>
                <div id= "container"> 
                	<table id="reviewTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">	
                	<tr> <th colspan="5"><h3>ReVoting Proposal List</h3></th></tr>
                	<tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Vote Completed</th><th>Vote Not Completed</th></tr>
                	</table>
                </div>
                <br/>
                <br/>
                <br/>
                <div id= "passProposal"> 
                  <table id="passTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
                  <tr> <th colspan="5"><h3>Passed Revoted Proposal</h3></th></tr>
                  <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th></tr>

                  </table>
                </div>
                <br/>
                <br/>
                <br/>
                <div id= "failedProposal"> 
                  <table id="failedTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
                  <tr> <th colspan="5"><h3>Failed Revoted Proposal</h3></th></tr>
                  <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th></tr>

                  </table>
                </div>
                </center>
            </div>
        );
    }
}

export default ReviewProposal;