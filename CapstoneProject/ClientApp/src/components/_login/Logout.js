import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert, Modal } from 'react-bootstrap';
import { Route, withRouter, Redirect } from 'react-router-dom';






export class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            isLoggingOut: false
        }
        
        this.LogOutAction = this.LogOutAction.bind(this);
    }

   


    async LogOutAction(event) {
        event.preventDefault();
        localStorage.clear();
        
        await this.setState({
            isLoggingOut: true
        });
        this.props.clickLogOut();
    }



    render() {
        if (this.state.isLoggingOut === true) {
            return <Redirect to="/home" />
        }
       
            return (
                <div className="static-modal">
                    <Modal.Dialog>


                        <Modal.Body>Are you sure you want to log out?</Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.props.cancel}>Back</Button>
                            <Button bsStyle="primary" onClick={(event) => this.LogOutAction(event)}>Log me out</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            );
        }
    
}