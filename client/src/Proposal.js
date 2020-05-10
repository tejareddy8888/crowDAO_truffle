import React, { Component } from "react";
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
import { Button } from 'react-bootstrap';
import history from './history';
import Web3 from "web3";



class Proposal extends Component {

	state = { accounts: null , contract: null};
	//state = { storageValue: 0, web3: null, accounts: null, contract: null };
  
  

  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      //window.location.reload()
      console.log('entered reload before');
      const web3 = await getWeb3();

      const account = await web3.eth.getAccounts();
      console.log('account intialised'+account);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log('networkId intialised'+networkId);

      const deployedNetwork = CrowDAO.networks[networkId];
      const instance = new web3.eth.Contract(CrowDAO.abi, deployedNetwork && deployedNetwork.address);
      console.log("instance:" + deployedNetwork);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ accounts : account, contract: instance});
      //console.log("Contracts :"+this.state.contract);
      //this.interval = setInterval(() => this.setState({ time: new Date.now() }), 5000);
    } catch (error) {
      // Catch any errors for any of the above operations.
      //console.log(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    	}
  	};


	addProposalFunc = async () => {
    //this.reload();
    //console.log('reloaded');
    //window.location.reload();
    const { accounts, contract } = this.state;
    // Update state with the result.
    //console.log("Accounts in Function:"+ accounts);
    console.log("Contract in Function:"+ contract);
    const proposal_name = document.getElementById('proptext').value;
    const proposal_val = document.getElementById('propval').value;
    //var respo;

    //console.log("Contract :"+contract);
    // Stores a given value, 15 by default.
    if(proposal_name !== '' && proposal_val !== ''){
    	await contract.methods.addProposal(proposal_name, proposal_val).send({from: accounts[0]});
    	document.getElementById('proptext').value = '';
    	document.getElementById('propval').value = '';
    	}
	else {
	console.log("No function call");	
	}
    
  	};



  	showProposalList = async () => {
    //this.setState({ accounts: null });
    const { accounts, contract } = this.state;
    //console.log("Contract in Function:"+ contract);
    

    var respo;
    var passedResp;
    var fitresp;
    var unfitResp;
    var propLength;
    //var propPassed;
    var i;
    
    await contract.methods.getProposalCount().call().then(function(response){ propLength = response;});
    //console.log(propLength);
    //This loop only display the active proposals only.
    for(i=0;i<=propLength-1;i++){
    	await contract.methods.hasVotingPeriodExpired(i).call().then(function(response1){ passedResp = response1;});
    	await contract.methods.getProposalByIndex(i).call().then(function(response){ respo = response;});
    	//await contract.methods.hasProposalPassed(i).call().then(function(response){ passedResp = response;});
    	//console.log(passedResp);
    	if(passedResp == false)
    	{
    	var newRow=document.getElementById('myTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		  cell1.appendChild(document.createTextNode(respo[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(respo[1]));
  		var cell3   = newRow.insertCell(2);
  		cell3.appendChild(document.createTextNode(respo[2]));


  		//Yes button for Vote
  		var cell4   = newRow.insertCell(3);
  		var button = document.createElement('button');
  		button.innerHTML = 'Yes';
  		button.onclick = this.voteAdd;
  		//button.id = "yesbutton";
  		button.value = i;
  		cell4.appendChild(button);



  		//No button for Vote
  		var cell5   = newRow.insertCell(4);
  		var button = document.createElement('button');
  		button.innerHTML = 'No';
  		button.onclick = this.voteAdd;
  		//button.id = "nobutton";
  		button.value = i;
  		cell5.appendChild(button);
  		}
    }	

    //This loop only represent the Passed proposals
    for(i=0;i<=propLength-1;i++){
    	await contract.methods.hasVotingPeriodExpired(i).call().then(function(response1){ passedResp = response1;});
    	await contract.methods.getProposalByIndex(i).call().then(function(response){ fitresp = response;});
      //await contract.methods.hasProposalPassed(i).call().then(function(response){ propPassed = response;});
    	if(passedResp == true & fitresp[5] == false & (fitresp[3] > fitresp[4]))
    	{
    	var newRow=document.getElementById('passTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		cell1.appendChild(document.createTextNode(fitresp[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(fitresp[1]));
  		var cell3   = newRow.insertCell(2);
  		cell3.appendChild(document.createTextNode(fitresp[2]));

  		}
		  	
    }	

    //This loop only represent the expired proposals
    for(i=0;i<=propLength-1;i++){
    	await contract.methods.hasVotingPeriodExpired(i).call().then(function(response1){ passedResp = response1;});
    	await contract.methods.getProposalByIndex(i).call().then(function(response){ unfitResp = response;});
    	
    	if(passedResp == true & unfitResp[4] >= unfitResp[3])
    	{
    	var newRow=document.getElementById('failedTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		cell1.appendChild(document.createTextNode(unfitResp[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(unfitResp[1]));
  		var cell3   = newRow.insertCell(2);
  		cell3.appendChild(document.createTextNode(unfitResp[2]));

  		}
		  	
    }	

    document.getElementById("myBtn").disabled = true; 

    //this.setState({ accounts: accounts[0] });
};


voteAdd = async (event) => {
    const { accounts, contract } = this.state;
    var vote_val = null;
    if(event.target.innerHTML == "Yes"){vote_val = 1;}
    else {vote_val = 0;}
    var proposal_index = event.target.value;
    
    console.log("Acounts :"+accounts[0]);

    //console.log("This is for testing purpose only."+ proposal_index+" : "+vote_val);
    await contract.methods.submitVote(proposal_index, vote_val).send({from: accounts[0]});
	};


    render() {
        //window.location.reload();
        return (
            <div>
            	<h1>Create Proposal</h1>
                <p>Your Account {this.props.location.state.account} have {this.props.location.state.balance} ETH balance</p>
                <div>
                	<h3>Create Proposal with the following details</h3>
                	<label for="propname">Enter the proposal:</label>&nbsp;
            		<input type="text" id="proptext" name="proptext" /><br />
            		<label for="propvalue">Enter the proposal value:</label>&nbsp;
            		<input type="text" id="propval" name="propval" /><br />
            		<button onClick={this.addProposalFunc}> Create Proposal </button>
            		<button id="myBtn" onClick={this.showProposalList}> Show Proposal </button>
                <Button variant="btn btn-success" onClick={() => history.push('/ReviewProposal', { account: this.state.accounts})}>Review your Proposal</Button>
            	</div>
                <div id= "container"> 
                	<table id="myTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">	
                	<tr> <th colspan="5"><h3>Proposal List</h3></th></tr>
                	<tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Vote(Yes)</th><th>Vote(No)</th></tr>
                	</table>
                </div>
                <div id= "passProposal"> 
                  <table id="passTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
                  <tr> <th colspan="5"><h3>Passed Proposal</h3></th></tr>
                  <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th></tr>

                  </table>
                </div>
                <div id= "failedProposal"> 
                  <table id="failedTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
                  <tr> <th colspan="5"><h3>Failed Proposal</h3></th></tr>
                  <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th></tr>

                  </table>
                </div>
			</div>
        );
    }
}

export default Proposal;