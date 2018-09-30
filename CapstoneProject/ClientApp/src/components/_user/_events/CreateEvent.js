import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { SelectGroups } from './SelectGroups';

export class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasGroups: false
        }
    }

    render() {
        var action;
        if (!this.state.hasGroups) {
            action = <SelectGroups />
        }
        return (
            <div>
                <h2>Create Event</h2>
                <Row>
                    {action}
                </Row>
                <Row>
                    <Col md={3}>
                        <Button onClick={this.props.backToEventHome}>Back</Button>
                    </Col>
                </Row>
            </div>
            );
    }



}