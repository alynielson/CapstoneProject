import React, { Component } from 'react';
import {Form, FormGroup, FormControl, Col, Row, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';


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
        this.handleResponse = this.handleResponse.bind(this);
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
        const data = {
            email: this.state.email,
            password: this.state.password
        };
        event.preventDefault();
        var resultData = null;
        await fetch('api/Users/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(this.handleResponse).then(function (response) { return response.json(); }).then(function (jsonData)
            {
                return resultData = jsonData;
            }).catch(function (error) { console.log(error); });
        if (resultData !== null) {

            this.setState({ id: resultData.id });
            localStorage.clear();
            localStorage.setItem('userId', resultData.id);
            localStorage.setItem('firstname', resultData.first_name);
            localStorage.setItem('lastname', resultData.last_name);
            this.props.loggedIn();
        }
    }

    shouldShowErrorMessage() {
        return this.state.errorMessage !== '';
    }

    handleResponse(response) {
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
        const style = {
            //backgroundImage: `url(${Background})`,
            //backgroundSize: "contain",
            backgroundColor: "purple",
            height: "85vh",
            
        };
        if (this.state.id != null) {
            return <Redirect to="/routes" />
        }
            return (
                <div style={style}>

                    <Row className="empty-space10percent">
                       
                    </Row>
                    <Row className="empty-space10percent">
                    </Row>
                   

                    <Row className="empty-space10percent">
                        <Col md={4} mdOffset={4} className="text-center">
                            <h1 className="page-title"> Log in </h1> </Col>
                    </Row>
                    <Row className="empty-space10percent">
                        <Col md={4} mdOffset={4}>
                        <div hidden={!this.shouldShowErrorMessage()}>
                            <Alert>{this.state.errorMessage}</Alert>
                            </div>
                            </Col>
                    </Row>
                    <Row>
                        <Col md={4} mdOffset={4}>
                            
                           
                            <Form>
                                <FormGroup>
                                    
                                    <FormControl
                                        type="text"
                                        name="email"
                                        placeholder="Email Address"
                                        value={this.state.email}
                                        onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    
                                    <FormControl
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <a className="btn action-button" onClick={(event) => this.handleSubmit(event)}>Submit</a>
                            </Form>
                        </Col>
                       
                    </Row>
                </div>
            );
    }
}