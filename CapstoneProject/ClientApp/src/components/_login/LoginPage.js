﻿import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';




export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isSuccessful: false,
            id: null
        }

        this.handleChange = this.handleChange.bind(this);
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

    checkIfCanSubmit() {
        return this.state.email !== '' && this.state.password !== '';
    }

    async handleSubmit(event) {
        const data = { email: this.state.email, password: this.state.password};
        event.preventDefault();
        var resultId = null;
        await fetch('api/Users/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(this.handleRedirect).then(function (response) { return response.json(); }).then(function (jsonData) { return resultId = jsonData.id; }).catch(function (error) { console.log(error);});
        if (resultId !== null) {

            this.setState({ id: resultId });
            localStorage.clear();
            localStorage.setItem('userId', resultId);
            
        }

    }

    shouldShowErrorMessage() {
        return this.state.errorMessage !== '';
    }

   


    handleRedirect(response) {
        var errorText= '';
        if (response.status === 200) {
            console.log("Successful");
            this.setState({ errorMessage: errorText, isSuccessful: true });
            
            return response;
        }
       else if (response.status === 401) {
            errorText = "Password was incorrect. Please try again.";
        }
        else if (response.status === 404) {
            errorText = "Email was not found. Please try again.";
        }
        else if (response.status === 204) {
            errorText = "An error occurred. Please try again.";
        }
        else {
            errorText = "Unable to get a response from the server.";
        }
        this.setState({ errorMessage:  errorText}
        )
        throw Error(errorText);

    }


    render() {
        if (this.state.id !== null) {
            return (<div><Redirect to={`/users`}/></div>);
        }
        else {
            return (

                <div>
                    <h1> Log in </h1>
                    <Row>
                        <Col md={4}>
                            <div hidden={!this.shouldShowErrorMessage()}>
                                <Alert>{this.state.errorMessage}</Alert>
                            </div>
                            <Form>


                                <FormGroup>
                                    <ControlLabel>Email Address</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange} />



                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}

                                    />


                                </FormGroup>
                                <Button disabled={!this.checkIfCanSubmit()} className="btn btn-primary" onClick={(event) => this.handleSubmit(event)}>Submit</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            );
        }
    }
}