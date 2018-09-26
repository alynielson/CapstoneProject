import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';


export class CreateRoute extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Button onClick={this.props.returnToRouteHome}>Back</Button>
                    <Button>Finish</Button>
                </ButtonToolbar>
            </div>
            
            
            
            );




    }
}