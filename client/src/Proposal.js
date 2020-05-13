import React, { Component } from "react";
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
import { Button } from 'react-bootstrap';
import history from './history';
import Web3 from "web3";



class Proposal extends Component {

	//state = { accounts: null , contract: null};
	state = { storageValue: 0, web3: null, accounts: null, contract: null , status : "updated" };
  
  componentDidMount = async () => {
    console.log("In componentDidMount()");
    try {

      // Get network provider and web3 instance.
      //window.location.reload()
      console.log('entered reload before');
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();
      console.log('account intialised'+accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log('networkId intialised'+networkId);

      const deployedNetwork = CrowDAO.networks[networkId];
      const instance = new web3.eth.Contract(CrowDAO.abi, deployedNetwork && deployedNetwork.address);
      console.log("instance:" + deployedNetwork);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance,status:"updated" }, this.getBalance);
      //console.log("Contracts :"+this.state.contract);
      //this.interval = setInterval(() => this.setState({ time: new Date.now() }), 5000);
      this.showProposalList();
      this.checkTheShare();
      window.ethereum.on('accountsChanged', this.handleUpdate);
    } catch (error) {
      // Catch any errors for any of the above operations.
      //console.log(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    	}
    };

    checkTheShare = async() => {

      const { web3,accounts, contract } = this.state;
  
      // Stores a given value, 15 by default.
      //await contract.methods.selfAdd(15).send({from: accounts[0]});
  
      // Get the value from the contract to prove it worked.
      var value = await contract.methods.fetchProposalShare(0).call();
      value = web3.utils.fromWei(value, 'ether');
      console.log("in checkshare : "+value);
 
    };


    getBalance= async () => {
      const { web3,accounts, contract } = this.state;
  
      // Stores a given value, 15 by default.
      //await contract.methods.selfAdd(15).send({from: accounts[0]});
  
      // Get the value from the contract to prove it worked.
      var value = await contract.methods.getBalance(accounts[0]).call();
      value = web3.utils.fromWei(value, 'ether');
      // Update state with the result.
      this.setState({ storageValue: value });
    };

addProposalFunc = async () => {
    //this.reload();
    //console.log('reloaded');
    //window.location.reload();
    const { web3,accounts, contract } = this.state;
    // Update state with the result.
    //console.log("Accounts in Function:"+ accounts);
    console.log("Contract in Function:"+ contract);
    const proposal_name = document.getElementById('proptext').value;
    const proposal_val = document.getElementById('propval').value;
    console.log(proposal_val);
    var amount = web3.utils.toWei(proposal_val, 'ether');
    //var respo;
    console.log("proposal:"+ proposal_name + "value" + amount );
    //console.log("Contract :"+contract);
    // Stores a given value, 15 by default.
    if(proposal_name !== '' && proposal_val !== ''){
      console.log("tried to trigger");
      await contract.methods.addProposal(proposal_name, amount).send({from: accounts[0]});
      console.log("triggered");
    	document.getElementById('proptext').value = '';
      document.getElementById('propval').value = '';
    	}
	else {
	console.log("No function call");	
  }
  window.location.reload();
  };



showProposalList = async () => {
    //this.setState({ status: "updated" });
    const { web3, accounts, contract } = this.state;
    //console.log("Contract in Function:"+ contract);
  
    var Proprespo;
    var TimeResp;
    var propLength;
    var propPassed;
    var i;
    
    await contract.methods.getProposalCount().call().then(function(response){ propLength = response;});
    console.log(propLength);
    //This loop only display the active proposals only.
    for(i=0;i<=propLength-1;i++)
    {
      console.log(i)
    	await contract.methods.hasVotingPeriodExpired(i).call({from: accounts[0]}).then(function(response){ TimeResp = response;});
      await contract.methods.getProposalByIndex(i).call().then(function(response){ Proprespo = response;});
      //await contract.methods.hasProposalPassed(i).call().then(function(response){ propPassed = response;});
      console.log("for index i "+i+" the proposalName is "+Proprespo[1]+" expired its time "+TimeResp);
    	if(TimeResp == false)
    	{
    	var newRow=document.getElementById('myTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		  cell1.appendChild(document.createTextNode(Proprespo[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(Proprespo[1]));
      var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(Proprespo[2], 'ether');
  		cell3.appendChild(document.createTextNode(amount));


  		//Yes button for Vote
  		var cell4   = newRow.insertCell(3);
  		var button = document.createElement('button');
  		button.innerHTML = 'Yes';
  		button.onclick = this.voteAdd;
  		//button.id = "yesbutton";
  		button.value = Proprespo[0];
  		cell4.appendChild(button);



  		//No button for Vote
  		var cell5   = newRow.insertCell(4);
  		var button = document.createElement('button');
  		button.innerHTML = 'No';
  		button.onclick = this.voteAdd;
  		//button.id = "nobutton";
  		button.value = Proprespo[0];
  		cell5.appendChild(button);
      }
      

      //await contract.methods.hasProposalPassed(i).call().then(function(response){ propPassed = response;});
    	else if(TimeResp == true & Proprespo[5] == false & (Proprespo[3] > Proprespo[4]))
    	{

    	var newRow=document.getElementById('passTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		cell1.appendChild(document.createTextNode(Proprespo[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(Proprespo[1]));
  		var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(Proprespo[2], 'ether');
  		cell3.appendChild(document.createTextNode(amount));

  		}
    	
    	else if(TimeResp == true & Proprespo[4] >= Proprespo[3])
    	{
    	var newRow=document.getElementById('failedTable').insertRow();
    	var cell1   = newRow.insertCell(0);
		cell1.appendChild(document.createTextNode(Proprespo[0]));
		// Insert a cell in the row at cell index 1
  		var cell2   = newRow.insertCell(1);

  		cell2.appendChild(document.createTextNode(Proprespo[1]));
  		var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(Proprespo[2], 'ether');
  		cell3.appendChild(document.createTextNode(amount));

      }

      // else if(TimeResp == true & propPassed == false)
    	// {
      //   var newRow=document.getElementById('passTable').insertRow();
      //   var cell1   = newRow.insertCell(0);
      // cell1.appendChild(document.createTextNode(Proprespo[0]));
      // // Insert a cell in the row at cell index 1
      //   var cell2   = newRow.insertCell(1);

      //   cell2.appendChild(document.createTextNode(Proprespo[1]));
      //   var cell3   = newRow.insertCell(2);
      //   cell3.appendChild(document.createTextNode(Proprespo[2]));

  		// }
		  	
    }	
    console.log('completed my process')

    //this.setState({ accounts: accounts[0] });
};

voteAdd = async (event) => {
    const { accounts, contract } = this.state;
    var vote_val = null;
    if(event.target.innerHTML == "Yes"){vote_val = 1;}
    else {vote_val = 2;}
    var proposal_index = event.target.value;
    console.log("Acounts :"+accounts[0]);
    //console.log("This is for testing purpose only."+ proposal_index+" : "+vote_val);
    await contract.methods.submitVote(proposal_index, vote_val).send({from: accounts[0]}).then(function(error,response){if(!error){console.log(response)} else {console.log(error)}});
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
      //history.push('/')
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
      console.log("In Render()");
        return (
            <div>
            	<h1>Create Proposal</h1>
                <p>Your Account {this.state.accounts} have {this.state.storageValue} ETH balance</p>
            <div>
                	<h3>Create Proposal with the following details</h3>
                	<label for="propname">Enter the proposal:</label>&nbsp;
            		<input type="text" id="proptext" name="proptext" /><br />
            		<label for="propvalue">Enter the proposal value:</label>&nbsp;
            		<input type="text" id="propval" name="propval" /><br />
            		<button class= "btn" onClick={this.addProposalFunc}> Create Proposal </button>
                <Button variant="btn btn-success" onClick={() => history.push('/ReviewProposal', { account: this.state.accounts})}>Vote Completed Proposals</Button>
                <Button variant="btn btn-success" onClick={() => history.push('/MyProposal', { account: this.state.accounts})}>MyProposals</Button>
                <Button variant="btn btn-success" onClick={() => history.push('/AcceptProposal', { account: this.state.accounts})}>ProcessMyProposal</Button>
            </div>
            <br/>
            <br/>
            <br/>
            <center>
                <div id= "container">
                	<table id="myTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">	
                	<tr> <th colspan="5"><h3>Proposal List</h3></th></tr>
                	<tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Vote(Yes)</th><th>Vote(No)</th></tr>
                	</table>
                </div>
                <br/>
                <br/>
                <br/>
                <div id= "passProposal"> 
                  <table id="passTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
                  <tr> <th colspan="5"><h3>Passed Proposal</h3></th></tr>
                  <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th></tr>

                  </table>
                </div>
                <br/>
                <br/>
                <br/>                
                <div id= "failedProposal"> 
                  <table id="failedTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
                  <tr> <th colspan="5"><h3>Failed Proposal</h3></th></tr>
                  <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th></tr>

                  </table>
                </div>
              </center>
			</div>
        );
    }
}

export default Proposal;