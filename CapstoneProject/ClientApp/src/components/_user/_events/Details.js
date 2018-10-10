import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Table, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import moment from 'moment';

export class Details extends Component{

    render() {
        const infoBox = {
            backgroundColor: "#c2e6ff",
            marginTop: "10px",
            paddingLeft: "15px",
            paddingTop: "20px",
            paddingBottom: "10px",
            paddingRight: "15px",
            color: "#555",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px"
        }
        return (
            <div style={infoBox}>
            <Form>
            <FormGroup>
                Date: {moment(this.props.date).format('dddd, MMMM Do YYYY')}
            </FormGroup>
            <FormGroup>
                Time: {moment(this.props.time).format('HH:mm a')}
            </FormGroup>
            <FormGroup>
               Description: {this.props.description}
            </FormGroup>
            <FormGroup>
                Organizer: {this.props.organizer}
            </FormGroup>
            <FormGroup>
                Starting Address: {this.props.address}
                </FormGroup>
                </Form>
                </div>
            );
    }
}