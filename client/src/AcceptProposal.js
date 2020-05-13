import React, { Component } from 'react';
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
//import { Button } from 'react-bootstrap';
import history from './history';

class AcceptProposal extends Component {

	//state = { accounts: null , contract: null, storageValue: 0 };
	state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      //console.log("Accounts are:"+ accounts);

      const deployedNetwork = CrowDAO.networks[networkId];
      const instance = new web3.eth.Contract(CrowDAO.abi, deployedNetwork && deployedNetwork.address);
      //console.log("instance:" + deployedNetwork.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      //console.log("Contracts:"+contract);
      this.loadAcceptanceProposals();
      this.loadSettlementProposals();
      window.ethereum.on('accountsChanged', this.handleUpdate);  
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

	loadAcceptanceProposals= async () => {
    const { web3,accounts,contract } = this.state;

      var passedResp;
      var fitresp;
      var i;
      var propLength;
      var didpassResp;
      var Abortresp;

      await contract.methods.getProposalCount().call().then(function(response){ propLength = response;});

      console.log("loadAcceptanceProposals Function");


      for(i=0;i<=propLength-1;i++){
      //await contract.methods.isProposer(i).call().then(function(response){ OwnerResp = response;});
      await contract.methods.hasVotingPeriodExpired(i).call().then(function(response1){ passedResp = response1;});
      await contract.methods.getProposalByIndex(i).call().then(function(response){ fitresp = response;});
      await contract.methods.didProposalPass(i).call().then(function(response){didpassResp = response;});
      await contract.methods.didProposalAborted(i).call().then(function(response){ Abortresp = response;});
      console.log("Abortresp"+Abortresp)
      console.log("didpassResp"+didpassResp)
      console.log("TimeExpired: "+passedResp+"didpass: "+fitresp[5]);
      if(passedResp == true && didpassResp == false && fitresp[3] > fitresp[4] && fitresp[6] == accounts[0])
      {
        
      var newRow=document.getElementById('reviewTable').insertRow();
      // Insert a cell in the row at cell index 0
      var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(fitresp[0]));
      // Insert a cell in the row at cell index 1
      var cell2   = newRow.insertCell(1);

      cell2.appendChild(document.createTextNode(fitresp[1]));
      var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(fitresp[2], 'ether');      
      cell3.appendChild(document.createTextNode(amount));

      //Accept Proposal Button
      var cell4   = newRow.insertCell(3);
      var button = document.createElement('button');
      button.innerHTML = 'Accept Proposal';
      button.onclick = this.acceptProposal;
      button.id = "acceptProposalButton"+i;
      button.value = i;
      cell4.appendChild(button);
      //if(fitresp[5] == true){document.getElementById("acceptProposalButton"+i).disabled = true;}
      //console.log(fitresp[5]);

      }
        
    }
  };

  loadSettlementProposals= async () => {
    const { web3,accounts, contract } = this.state;

      var passedResp;
      var FinalpassedResp;
      var Procresp;
      var Abortresp;
      var i;
      var propLength;
      var fitresp = null;
      //var OwnerResp;

      await contract.methods.getProposalCount().call().then(function(response){ propLength = response;});
      console.log("loadSettlementProposals Function");
      for(i=0;i<=propLength-1;i++){
        //await contract.methods.isProposer(i).call().then(function(response){ OwnerResp = response;});
        await contract.methods.didProposalPass(i).call().then(function(response){passedResp = response;});
        console.log("passedResp"+passedResp)
        await contract.methods.didProposalFinalPass(i).call().then(function(response){FinalpassedResp = response;});
        console.log("FinalpassedResp"+FinalpassedResp)
        await contract.methods.didProposalProcessed(i).call().then(function(response){ Procresp = response;});
        console.log("Procresp"+Procresp)
        await contract.methods.didProposalAborted(i).call().then(function(response){ Abortresp = response;});
        console.log("Abortresp"+Abortresp)
        await contract.methods.getProposalByIndex2(i).call().then(function(response1){ fitresp = response1;});
        console.log(fitresp[6]);
        console.log("address"+accounts[0]);
      if (passedResp == true && FinalpassedResp == false && Procresp == true && Abortresp == false && fitresp[4] > fitresp[5])
      { // change finalpass to false
          
      var newRow=document.getElementById('settleTable').insertRow();
      // Insert a cell in the row at cell index 0
      var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(fitresp[0]));
      // Insert a cell in the row at cell index 1
      var cell2   = newRow.insertCell(1);
      cell2.appendChild(document.createTextNode(fitresp[1]));

      var cell3   = newRow.insertCell(2);
      var amount = web3.utils.fromWei(fitresp[2], 'ether');      
      cell3.appendChild(document.createTextNode(amount));

      //Accept Proposal Button
      var cell4   = newRow.insertCell(3);
      var button = document.createElement('button');
      button.innerHTML = 'Settle Balance';
      button.onclick = this.settleBalance;
      button.id = "SettleProposalBalance"+i;
      button.value = fitresp[0];
      cell4.appendChild(button);
      }
      else if (passedResp == true && FinalpassedResp == false && Procresp == true && Abortresp == false && fitresp[4] <= fitresp[5] && fitresp[6] == accounts[0])
      { // change finalpass to false
          
      var newRow=document.getElementById('settleTable').insertRow();
      // Insert a cell in the row at cell index 0
      var cell1   = newRow.insertCell(0);
      cell1.appendChild(document.createTextNode(fitresp[0]));
      // Insert a cell in the row at cell index 1
      var cell2   = newRow.insertCell(1);      
      cell2.appendChild(document.createTextNode(fitresp[1]));

      var cell3   = newRow.insertCell(2);
      cell3.appendChild(document.createTextNode(fitresp[2]));

      //Accept Proposal Button
      var center2 = document.createElement('center');
      var cell4   = newRow.insertCell(3);
      var button = document.createElement('button');
      button.innerHTML = 'Refund';
      button.onclick = this.refundBalance;
      button.id = "refundButton"+i;
      button.value = fitresp[0];
      center2.appendChild(button)
      cell4.appendChild(center2);
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
        console.log("Reached haya"+ checkPassRes[5]);
        await contract.methods.hasProposalPassed(proposal_index).send({from: accounts[0]}).then(function(response){ console.log(response)});;
      }
      else{
        alert(`Contract has been accepted already`);
      }
    //document.getElementById("acceptProposalButton").disabled = true; 
  };

  settleBalance= async (event) => {
    const { web3, accounts, contract } = this.state;
    //var checkPassRes;
    var PassRes;
    var i = event.target.value;
    await contract.methods.getProposalByIndex(i).call().then(function(response){ PassRes = response;});
    console.log();
    await contract.methods.hasProposalPassedFinal(i).send({from: accounts[0]}).then(function(response){ console.log(response);});;
    //const amount = web3.utils.toWei(PassRes[3], 'ether');
    //await contract.methods.Transfer(PassRes[6],PassRes[3]).send({from: accounts[0]});        
  }

  refundBalance = async (event) => {
    const { accounts, contract } = this.state;
    var i = event.target.value;
    console.log("Refunding Balance");
    await contract.methods.hasProposalPassedFinal(i).send({from: accounts[0]}).then(function(response){ console.log(response);});;
    //await contract.methods.refundFunds(i).send({from: accounts[0]});
  }

    
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
    this.setState({ web3, accounts, contract: instance });

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
          <h1>Accept Proposals</h1>
            <p>Your Special Account {this.state.accounts}</p>
            <div>
            <h3>Review the proposal with the following details</h3>
            </div>
            <div id= "container"> 
            <center>
              <table id="reviewTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">	
              <tr> <th colspan="5"><h3>Review Proposal List</h3></th></tr>
              <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Accept the Proposal</th></tr>
              </table>
            </center>
            <br/>
            <br/>
            <br/>
            <center>
              <table id="settleTable" border= "5"   width="50%"   cellpadding="4" cellspacing="3">  
              <tr> <th colspan="5"><h3>Settle Proposal List</h3></th></tr>
              <tr><th>ID</th><th>Proposal</th><th>Proposal Value</th><th>Settle the Proposal</th></tr>
              </table>
            </center>
            </div>
        </div>
    );
}
}

export default AcceptProposal;