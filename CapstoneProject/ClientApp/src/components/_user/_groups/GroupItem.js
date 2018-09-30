import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';

export class GroupItem extends Component {
    constructor(props) {
        super(props);
    }
    checkIfActive() {
        if (this.props.existingGroups.map(a => a.id).includes(this.props.value)) {
            return true;
        }
        else {
            return false;
        }
    }


    render() {
        return (
            
            <ListGroupItem onClick={this.props.onClick} active={this.checkIfActive()}>{this.props.display} </ListGroupItem>
            );
    }
}