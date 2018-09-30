import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';

export class EditGroup extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <Row>
                <Col md={4}>
                    <ButtonToolbar>
                        <Button onClick={this.props.returnToEventHome}>Back</Button>
                        <Button onClick={(event) => this.submitedit(event)}>Finish</Button>
                    </ButtonToolbar>
                    </Col>
                </Row>
            );
    }

}