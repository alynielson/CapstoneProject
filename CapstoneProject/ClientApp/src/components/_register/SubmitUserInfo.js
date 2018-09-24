import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';


export class SubmitUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            state: '',
            states: []
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
            <div>
                <h2> Hello, {this.props.first_name}! </h2>
                <h4>Tell us a little about yourself. Specifying your location will help us find routes, groups, and events near you.</h4>
                <Row>
                    <Col md={4}>
                        <Form>
                            <FormGroup>
                                <FormControl
                                    componentClass="select">
                                        {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}
                                    
                                    


                            

                                </FormControl>
                            </FormGroup>
                            
                        </Form>
                    </Col>
                </Row>
            </div>



            );
    }
    
}