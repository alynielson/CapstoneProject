import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Alert } from 'react-bootstrap';
import { SubmitUserInfo } from './SubmitUserInfo'
import '../MainStyles.css'



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
        if (this.checkIfCanSubmit()) {
            var resultId = null;
            const data = { first_name: this.state.first_name, last_name: this.state.last_name, password: this.state.password, email: this.state.email };
            event.preventDefault();
            await fetch('api/Users/Create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(this.handleResponse).then(function (response) { return response.json(); }).then(function (jsonData) { return resultId = jsonData.id; }).catch(function (error) { console.log(error); });
            console.log(resultId);
            if (resultId !== null) {

                this.setState({ id: resultId });
                localStorage.clear();
                localStorage.setItem('userId', this.state.id);
                localStorage.setItem('firstname', this.state.first_name);
                localStorage.setItem('lastname', this.state.last_name);
                this.props.loggedIn();
            }
        }
        else {
            this.setState({
                errorMessage: "You didn't fill out all of the fields!"
            });
        }
    }

    shouldShowErrorMessage() {
        return this.state.errorMessage !== '';
    }

    handleResponse(response) {
        var errorText = '';
        if (response.status === 200) {
            this.setState({
                errorMessage: errorText
            });
            return response;
        }
        else if (response.status === 409) {
            errorText = 'That email already exists!';
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
        const style = {
            backgroundColor: "purple",
            height: "85vh",
        }
        if (this.state.id === null) {
            return (
                <div style={style}>
                    <Row className="empty-space10percent" />
                    <Row className="empty-space10percent">
                        <Col md={4} mdOffset={4} className="text-center">
                            <h1 className="page-title"> Sign up </h1>
                            </Col>
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
                                        placeholder="First Name"
                                        type="text"
                                        name="first_name"
                                        value={this.state.first_name}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Last Name"
                                        type="text"
                                        name="last_name"
                                        value={this.state.last_name}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Email Address"
                                        type="text"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange} />
                                    <small hidden={this.validateEmail()} className="form-text text-muted">Not a valid email</small>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                    <small hidden={this.validatePassword()} className="form-text text-muted">Password not long enough</small>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Confirm Password"
                                        type="password"
                                        name="password_confirmation"
                                        value={this.state.password_confirmation}
                                        onChange={this.handleChange}
                                    />
                                    <small hidden={this.confirmPasswordsMatch()} className="form-text text-muted">Passwords do not match</small>
                                </FormGroup>
                                <a className="btn action-button" onClick={(event) => this.handleSubmit(event)}>Submit</a>
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
