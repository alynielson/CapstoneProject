﻿import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert, Modal } from 'react-bootstrap';
import { Route, withRouter, Redirect } from 'react-router-dom';






export class SaveRouteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            states: [],
            name: '',
            description: '',
            city: '',
            state: ''
        }
      
    }
    componentDidMount() {
        fetch("api/Users/GetStatesList")
            .then(response => { return response.json(); })
            .then(data => {
                let statesToSelect = data.map(state => { return { value: state, display: state } });
                this.setState({ states: [{ value: '', display: '' }].concat(statesToSelect) });
            })
            .catch(error => console.log(error));

    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        
       
            return (
              
                    <Modal show={this.props.show}  dialogClassName="modal-form-custom">
                    
                    <Modal.Body>
                        <h2>Save</h2>
                        <h4>Save your route so you can add comments to it and be able to find it later.</h4>
                        <h6>Once you save, you won't be able to edit the route's points.</h6>
                        <Form>
                            <FormGroup>
                                <ControlLabel>Route Name</ControlLabel>
                                <FormControl
                                    type="text"
                                   
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Description</ControlLabel>
                                <FormControl
                                    type="text"
                                    name="description"
                                    
                                    value={this.state.description}
                                    onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Location</ControlLabel>
                                <FormControl
                                    type="text"
                                    name="city"
                                    value={this.state.city}
                                    onChange={this.handleChange} />
                            
                            
                            <FormControl
                                componentClass="select"
                                name="state"
                                value={this.state.state}
                                onChange={this.handleChange}
                            >
                                {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}

                                </FormControl>
                            </FormGroup>
                            </Form>
                            </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.props.hiding}>Back</Button>
                        <Button bsStyle="primary" onClick={() => this.props.submitting(this.state.name, this.state.description, this.state.city, this.state.state)}>Save</Button>
                        </Modal.Footer>
                       
                        </Modal>
               
            );
        
    }
}