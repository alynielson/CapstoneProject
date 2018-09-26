import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateRoute } from './_routes/CreateRoute';



export class UserRouteContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createRoute: false
        }
        this.addNewRoute = this.addNewRoute.bind(this);
        this.backToAllRoutes = this.backToAllRoutes.bind(this);
    }

    addNewRoute(event) {
        event.preventDefault();
        this.setState({
            createRoute: true,
        })
    }

    backToAllRoutes() {
        this.setState({
            createRoute: false,
        })
    }

    render() {
        const returnToRoutes = this.backToAllRoutes;
        if (this.state.createRoute) {
            return (
                <div>
                    <CreateRoute returnToRouteHome={returnToRoutes} />
                </div>);
        }
        else {
            return (
                <div>
                    <Button onClick={(event) => this.addNewRoute(event)}>Create a Route</Button>
                    <div> Your Routes </div>
                </div>
                
            );
        }
    }




}