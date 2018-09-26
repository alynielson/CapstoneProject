import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row , ButtonToolbar} from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { UserHome } from '../_user/UserHome';


export class ConnectStrava extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldConnectToStrava: false,
            shouldRerouteToHome: false,
            
        }
        
        this.redirectToStrava = this.redirectToStrava.bind(this);
        this.redirectToUserHome = this.redirectToUserHome.bind(this);
    }

    redirectToStrava(event) {
        event.preventDefault();
       
        this.setState({
            shouldConnectToStrava: true,
           
        });
    }

    redirectToUserHome(event) {
        event.preventDefault();
        this.setState({
            shouldRerouteToHome: true
        })
    }


    render() {
        if (this.state.shouldRerouteToHome === true) {
            return (
                <div>
               

                    <Redirect to={`/users` } />
                    </div>
            );
        }
        else if (this.state.shouldConnectToStrava === true) {
            return (
                <div>
                
                    <Redirect to={`/authorize-strava`} />
                    </div>
            );
        }
        else {
            return (
                <div>
                    <Row>
                        <Col md={4}>
                            <Form>
                    <h2>Awesome!</h2>
                    <h4>You're almost ready to go. If you connect your Strava account, you'll be able to view your ride/run results for the routes and events you complete all on the same page.</h4>
                                <h4>Never heard of Strava? You might want to check it out <a href="http://strava.com" target="_blank">here</a>. You can connect your account any time. </h4>
                            </Form>
                            <ButtonToolbar>
                    <Button bsStyle="success" onClick={(event) => this.redirectToStrava(event)}>Connect my Strava account</Button>
                                <Button bsSize="xsmall" bsStyle="primary" onClick={(event) => this.redirectToUserHome(event)}>Skip this, maybe later</Button>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                </div>
            );
        }
    }
}