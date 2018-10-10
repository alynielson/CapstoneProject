import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

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
        const style = {
            color: "#555"
        }
            return (
                <div className="static-modal">
                    <Modal.Dialog>
                        <Modal.Body style={style}>Are you sure you want to log out?</Modal.Body>
                        <Modal.Footer>
                            <a className="btn normal-buttons" onClick={this.props.cancel}>Back</a>
                            <a className="btn action-button modal-btn" bsStyle="primary" onClick={(event) => this.LogOutAction(event)}>Log me out</a>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            );
        }
    
}