﻿import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class SelectStartingPoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        this.props.changeAddress(value);
    }

    render() {
        let value = this.props.automaticAddress ? "Selected on map" : this.state.address;
        let change = this.props.automaticAddress ? null : this.handleChange;
        return (
            <FormGroup>
                <ControlLabel>Where will you be starting?</ControlLabel>
                <FormControl type="textarea" placeholder="Type an address or click a spot on the map" name="address" value={value} onChange={change} />
            </FormGroup>
            );
    }
} export default SelectStartingPoint;
