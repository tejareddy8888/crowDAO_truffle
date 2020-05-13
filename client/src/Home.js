import React, { Component } from "react";
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
import { Button } from 'react-bootstrap';
import history from './history';
import "./App.css";

class Home extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, addamount: 0 , ChairMen_balance : 0 };

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
      this.setState({ web3, accounts, contract: instance }, this.getBalance);
      //console.log("Contracts:"+contract);
      this.Balanceofchairman();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  Balanceofchairman= async () => {
    const {accounts,contract} = this.state;

    // Stores a given value, 15 by default.
    //await contract.methods.selfAdd(15).send({from: accounts[0]});
    var output;
    // Get the value from the contract to prove it worked.
    await contract.methods.BalanceOfchairperson().call({from: accounts[0]}).then(function(response){output = response;});
    console.log(output)
    return output;
  };


  getBalance= async () => {
    const { web3,accounts, contract } = this.state;

    // Stores a given value, 15 by default.
    //await contract.methods.selfAdd(15).send({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    var value = await contract.methods.getBalance(accounts[0]).call();
    value = web3.utils.fromWei(value, 'ether');
    var output;
    // Get the value from the contract to prove it worked.
    await contract.methods.BalanceOfchairperson().call({from: accounts[0]}).then(function(response){output = response;});
    // Update state with the result.
    output = web3.utils.fromWei(output, 'ether');
    this.setState({ storageValue: value, ChairMen_balance : output});
  };

  runSelfAdd = async () => {
    const { accounts, contract, web3 } = this.state;
    var amount = document.getElementById('mamount').value;
    //console.log("Displaying the amount from the text:"+amount);
    //console.log(typeof amount);
    // Stores a given value, 15 by default.
    amount = web3.utils.toWei(amount, 'ether');
    await contract.methods.invest().send({from: accounts[0],value : amount});
    var value = await contract.methods.getBalance(accounts[0]).call();
    value = web3.utils.fromWei(value, 'ether');
    // Update state with the result.
    this.setState({ storageValue: value });
  };

  handleUpdate = async() =>{
    try{
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
    window.ethereum.on('accountsChanged', this.handleUpdate);
    if (!this.state.web3) {
      return (<div>Loading Web3, accounts, and contract...</div>);
    } else if(this.state.storageValue >= 1)
    {
      return(
      <div className="App">
        <div class="center home-div">
              <div class="lead-text">Account : {this.state.accounts} </div>
              <div class="lead-text"> Current Balance: {this.state.storageValue} ether </div>
              <br/>
              <br/>
              <Button class="btn" variant="btn btn-success" onClick={() => history.push('/Proposal', { account: this.state.accounts, balance : this.state.storageValue})}>View Proposals</Button>
        </div>
    </div>
      );
    }
    else
    {
    return (
        <div className="App">
              <div class="center home-div">
                  <div class="lead-text">Account : {this.state.accounts} </div>
                  <div class="lead-text"> Current Balance: {this.state.storageValue} ETH </div>
                  <br/>
                  <label for="maddr">Amount:</label>&nbsp;
                  <input class="search-box" type="text" id="mamount" name="mamount" />&nbsp;
                  <br/>
                  <br/>
                  <button class="btn" onClick={this.runSelfAdd}>  ADD AMOUNT </button>
                  <br/>
                  <br/>
                  <b> Note: your account needs to have minimum 1 ETH value to perfrom action</b>
              </div> 
        </div>
        );
    }
  }


}


export default Home;