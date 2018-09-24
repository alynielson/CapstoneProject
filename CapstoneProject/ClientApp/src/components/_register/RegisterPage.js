import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { SubmitUserInfo } from './SubmitUserInfo'




export class Register extends Component {
   
    
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            errorMessage: '',
            id: null
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
       
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async handleSubmit(event) {
        var resultId = null;
        const data = { first_name: this.state.first_name, last_name: this.state.last_name, password: this.state.password, email: this.state.email };  
        event.preventDefault();
        await fetch('api/Users/Create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(this.handleRedirect).then(function (response) { return response.json(); }).then(function (jsonData) {return resultId = jsonData.id; }).catch(function (error) { console.log(error); });
        console.log(resultId);
        if (resultId !== null) {
            
            this.setState({ id: resultId });
        }
        }

    shouldShowErrorMessage() {
        return this.state.errorMessage !== '';
    }

   
    

    handleRedirect(response) {
        var errorText = '';
        if (response.status === 200) {
            this.setState({
                errorMessage: errorText
            });
            return response;
        }
        else if (response.status === 409) {
            errorText = 'The email you entered already exists.';
        }
        else {
            errorText = 'Unable to get a response from the server.';
        }
        this.setState({
            errorMessage: errorText
        });
        throw Error(errorText);
    }

    validatePassword() {
        return this.state.password.split('').length >= 10 || this.state.password === '';
    }

    confirmPasswordsMatch() {
        return this.state.password_confirmation === '' || this.state.password === this.state.password_confirmation;
    }

    validateEmail() {
        return this.state.email === '' || (this.state.email.split('').includes("@") && this.state.email.split('').includes("."));
    }

    checkIfCanSubmit() {
        return this.state.email.split('').includes("@")
            && this.state.email.split('').includes(".")
            && this.state.first_name !== ''
            && this.state.last_name !== ''
            && this.state.password !== ''
            && this.state.password_confirmation === this.state.password;
    }

   
    render() {
        if (this.state.id === null) {
            return (
                <div>
                    <h1> Register </h1>
                    <Row>
                        <Col md={4}>
                            <div hidden={!this.shouldShowErrorMessage()}>
                                <Alert>{this.state.errorMessage}</Alert>
                            </div>
                            <Form>
                                <FormGroup>
                                    <ControlLabel>First Name</ControlLabel>
                                    <FormControl

                                        type="text"
                                        name="first_name"
                                        value={this.state.first_name}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Last Name</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="last_name"
                                        value={this.state.last_name}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Email Address</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange} />
                                    <small hidden={this.validateEmail()} className="form-text text-muted">Not a valid email</small>


                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}

                                    />
                                    <small hidden={this.validatePassword()} className="form-text text-muted">Password not long enough</small>

                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Confirm Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        name="password_confirmation"
                                        value={this.state.password_confirmation}
                                        onChange={this.handleChange}

                                    />
                                    <small hidden={this.confirmPasswordsMatch()} className="form-text text-muted">Passwords do not match</small>

                                </FormGroup>




                                <Button disabled={!this.checkIfCanSubmit()} className="btn btn-primary" onClick={(event) => this.handleSubmit(event)}>Submit</Button>



                            </Form>
                        </Col>
                    </Row>
                </div>

            );
        }
        else {
            return (
                <SubmitUserInfo id={this.state.id} first_name={this.state.first_name} last_name={this.state.last_name} />
            );
        }
    }
}
