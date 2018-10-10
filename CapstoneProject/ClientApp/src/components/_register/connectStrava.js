import React, { Component } from 'react';
import { Button, Form,Col, Row , ButtonToolbar} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

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
        const style = {
            backgroundColor: "purple",
            height: "85vh",

        };
        const btnSeparator = {
            marginTop: "10px"
        }
        if (this.state.shouldRerouteToHome === true) {
            return (
                <div>
                    <Redirect to={`/routes` } />
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
                <div style={style}>
                    <Row className="empty-space10percent" />
                    <Row>
                        <Col md={6} mdOffset={3} className="text-center">
                            <Form>
                                <h2 className="page-title">Awesome!</h2>
                                <h4 className="page-subtitle">You're almost ready to go. If you connect your Strava account, you'll be able to view your ride/run results for the routes and events you complete all on the same page.</h4>
                                <h4 className="page-subtitle">Never heard of Strava? You might want to check it out <a href="http://strava.com" target="_blank">here</a>. You can connect your account any time. </h4>
                            </Form>
                           
                                <a className="btn action-button" onClick={(event) => this.redirectToStrava(event)}>Connect my Strava account</a>
                            <a className="btn normal-buttons" style={btnSeparator}onClick={(event) => this.redirectToUserHome(event)}>Skip this, maybe later</a>
                            
                        </Col>
                    </Row>
                </div>
            );
        }
    }
}