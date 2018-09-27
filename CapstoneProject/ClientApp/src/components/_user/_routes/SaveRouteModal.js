import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert, Modal } from 'react-bootstrap';
import { Route, withRouter, Redirect } from 'react-router-dom';






export class SaveRouteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
      
    }



    render() {
        
       
            return (
              
                    <Modal show={this.props.show}  >
                    <Modal.Dialog>


                        <Modal.Body>Are you sure you want to log out?</Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.props.hiding}>Back</Button>
                            <Button bsStyle="primary" >Log me out</Button>
                        </Modal.Footer>
                        </Modal.Dialog>
                        </Modal>
               
            );
        
    }
}