import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Table, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import moment from 'moment';

export class Details extends Component{

    render(){
        return (
            <Form>
            <FormGroup>
                <ControlLabel>Date</ControlLabel> {moment(this.props.date).format('dddd, MMMM Do YYYY')}
            </FormGroup>
            <FormGroup>
                <ControlLabel>Time</ControlLabel> {moment(this.props.time).format('HH:mm a')}
            </FormGroup>
            <FormGroup>
                <ControlLabel>Description</ControlLabel> {this.props.description}
            </FormGroup>
            <FormGroup>
                <ControlLabel>Organizer</ControlLabel> {this.props.organizer}
            </FormGroup>
            <FormGroup>
                <ControlLabel>Starting Address</ControlLabel>{this.props.address}
                </FormGroup>
                </Form>
            );
    }
}