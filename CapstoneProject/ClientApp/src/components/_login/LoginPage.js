import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row } from 'react-bootstrap';


export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
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

    handleSubmit(event) {
        const data = { email: this.state.email, password: this.state.password};
        event.preventDefault();
        fetch('api/Users/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(this.handleRedirect).then(function (response) { return response.json(); }).then(function (jsonData) { return console.log(jsonData); }).catch(function (error) { console.log(error);});


    }

   


    handleRedirect(response) {
        if (response.status === 200) {
            console.log("Successful");
            return response;
        }
       else if (response.status === 401) {
            var statusText = "Password was incorrect";
            //show stuff
            throw Error(statusText);
        }
        else if (response.status === 404) {
            var statusText = "User not found";
            throw Error(statusText);
        }
        else if (response.status === 204) {
            var statusText = "No content in request";
            throw Error(statusText);
        }
        else {
            var statusText = "Unable to get a response from the server";
        }
        throw Error(statusText);

    }


    render() {
        return (
            <div>
                <h1> Log in </h1>
                <Row>
                <Col md={4}>
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
      )
    }
}