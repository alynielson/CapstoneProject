import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert, Modal } from 'react-bootstrap';
import { Route, withRouter, Redirect } from 'react-router-dom';






export class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGoingBack: false,
            isLoggingOut: false
        }
        this.BackToSafety = this.BackToSafety.bind(this);
        this.LogOutAction = this.LogOutAction.bind(this);
    }

   


    LogOutAction(event) {
        event.preventDefault();
        localStorage.clear();
        this.setState({
            isLoggingOut: true
        });
    }

    BackToSafety(event) {
        event.preventDefault();
        this.setState({
            isGoingBack: true
        })
    }


    render() {
        if (this.state.isLoggingOut === true) {
            return (<div><Redirect to={`/home`} /></div>);
        }
        else if (this.state.isGoingBack === true) {
            return (<div><Redirect to={`/users`} /> </div>);
        }
        else {
            return (
                <div className="static-modal">
                    <Modal.Dialog>


                        <Modal.Body>Are you sure you want to log out?</Modal.Body>

                        <Modal.Footer>
                            <Button onClick={(event) => this.BackToSafety(event)}>Back</Button>
                            <Button bsStyle="primary" onClick={(event) => this.LogOutAction(event)}>Log me out</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            );
        }
    }
}