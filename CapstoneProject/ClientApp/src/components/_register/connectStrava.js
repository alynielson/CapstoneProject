import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row } from 'react-bootstrap';

export class ConnectStrava extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div>
                <h2>Awesome!</h2>
                <h4>You're almost ready to go. If you connect your Strava account, you'll be able to view your ride/run results for the routes and events you complete all on the same page.</h4>
                <h4>Never heard of Strava? You might want to check it out <a href="http://strava.com" target="_blank">here</a>. You can connect your account any time. </h4>
            </div>
            );
    }
}