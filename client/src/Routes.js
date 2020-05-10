import React, {Component} from 'react';
import { Router, Switch, Route } from "react-router-dom";

import Home from "./Home";
import Proposal from "./Proposal";
import AcceptProposal from "./AcceptProposal";
import ReviewProposal from "./ReviewProposal";
import history from './history';



export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/Proposal" component={Proposal} />
                    <Route path="/AcceptProposal" component={AcceptProposal} />
                    <Route path="/ReviewProposal" component={ReviewProposal} />
                </Switch>
            </Router>
        )
    }
}
