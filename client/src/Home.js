import React, { Component } from "react";
import CrowDAO from "./contracts/crowdao.json";
import getWeb3 from "./getWeb3";
import { Button } from 'react-bootstrap';
import history from './history';

import "./App.css";

class Home extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, addamount: 0 };

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

    // Stores a given value, 15 by default.
    //await contract.methods.selfAdd(15).send({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getBalance(accounts[0]).call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  runSelfAdd = async () => {
    const { accounts, contract } = this.state;
    const amount = document.getElementById('mamount').value;
    //console.log("Displaying the amount from the text:"+amount);
    //console.log(typeof amount);
    // Stores a given value, 15 by default.
    await contract.methods.selfAdd(amount).send({from: accounts[0]});
    const response = await contract.methods.getBalance(accounts[0]).call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    ///const log_e = this.state;
    if (!this.state.web3) {
      return (<div>Loading Web3, accounts, and contract...</div>);
    } else if(this.state.storageValue >= 100 & this.state.accounts != "0x9a9FF10B5034348944bfc62fdFd2d7E7fa8A5a90")
    {
      return(
      <div className="App">
        <h1>Welcome to CrowDAO!</h1>
        <p>Your decentralized autonomous organization</p>
        <p>
          Successfully registered, your account ID is {this.state.accounts}.
        </p>
        <div>The current stored value is: {this.state.storageValue}</div>
        <form>
          <Button variant="btn btn-success" onClick={() => history.push('/Proposal', { account: this.state.accounts, balance : this.state.storageValue})}>Click button to view Proposal</Button>
        </form>
      </div>
      );
    }
    else if(this.state.accounts == "0x9a9FF10B5034348944bfc62fdFd2d7E7fa8A5a90")
    {
      return(
      <div className="App">
        <h1>Welcome to CrowDAO!</h1>
        <p>Your decentralized autonomous organization</p>
        <p>
          Special registered account, your account ID is {this.state.accounts}.
        </p>
        <div>The current stored value is: {this.state.storageValue}</div>
        <form>
          <Button variant="btn btn-success" onClick={() => history.push('/AcceptProposal', { account: this.state.accounts, balance : this.state.storageValue })}>Click button to view Proposal</Button>
        </form>
      </div>
      );
    }
    else
    {
    return (
      <div className="App">
        <h1>Welcome to CrowDAO!</h1>
        <p>Your decentralized autonomous organization</p>
        <p>
          For successful registration, your account {this.state.accounts} needs to register with 100 ETH value.
        </p>
        <div>The current stored value is: {this.state.storageValue}</div>
        <div>
          <h1>Enter the amount to be added in your account.</h1>
            <label for="maddr">Amount:</label>&nbsp;
            <input type="text" id="mamount" name="mamount" />&nbsp;
            <button onClick={this.runSelfAdd}>  ADD AMOUNT </button>
        </div> 
      </div>
            );
    }
  }
}

export default Home;