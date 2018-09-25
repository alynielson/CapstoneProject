import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';
import { ConnectStrava } from './connectStrava';


export class SubmitUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            state: '',
            states: [],
            errorMessage: '',
            finished: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    async handleSubmit(event) {
        event.preventDefault();
        const data = { id: this.props.id, city: this.state.city, state: this.state.state };
        await fetch('api/Users/EnterLocation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(this.handleResponse).catch(error => console.log(error));

        if (this.state.errorMessage === '') {
            this.setState({ finished: true });
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
        else {
            errorText = 'Unable to get a response from the server.';
        }
        this.setState({
            errorMessage: errorText
        });
        throw Error(errorText);
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
        return this.state.city !== '' && this.state.state !== '';
    }

    render() {
        if (this.state.finished === false) {
            return (
                <div>
                    <h2> Hello, {this.props.first_name}! </h2>
                    <h4>Tell us a little about yourself. Specifying your location will help us find routes, groups, and events near you.</h4>
                    <Row>
                        <Col md={4}>
                            <div hidden={!this.shouldShowErrorMessage()}>
                                <Alert>{this.state.errorMessage}</Alert>
                            </div>
                            <Form>
                                <FormGroup>
                                    <ControlLabel>City</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="city"
                                        value={this.state.city}
                                        onChange={this.handleChange}
                                    />
                                    <ControlLabel>State</ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        name="state"
                                        value={this.state.state}
                                        onChange={this.handleChange}
                                    >
                                        {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}

                                    </FormControl>

                                </FormGroup>
                                <Button disabled={!this.checkIfCanSubmit()} className="btn btn-primary" onClick={(event) => this.handleSubmit(event)}>Submit</Button>

                            </Form>
                        </Col>
                    </Row>
                </div>



            );
        }
        else {
            return(
                <ConnectStrava id={this.props.id} first_name={this.props.first_name}/>
            );
        }
    }
    
}