import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateRoute } from './_routes/CreateRoute';
import { EditRoute } from './_routes/EditRoute';



export class UserRouteContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createRoute: false,
            editRoute: false,
            currentRouteId: null,
            coordinates: [{}],
            defaultLat: 43.0362012,
            defaultLng: -87.98582829999999
        }
        this.addNewRoute = this.addNewRoute.bind(this);
        this.backToAllRoutes = this.backToAllRoutes.bind(this);
        this.editRoute = this.editRoute.bind(this);
        this.doneCreatingNew = this.doneCreatingNew.bind(this);
    }

    addNewRoute(event) {
        event.preventDefault();
        this.setState({
            createRoute: true,
        })
    }

    editRoute(event) {
        event.preventDefault();
        this.setState({
            editRoute: true,
        })
    }

    backToAllRoutes() {
        this.setState({
            createRoute: false,
            editRoute: false,
            currentRouteId: null
        })
    }

    doneCreatingNew(id, coordinates) {
        this.setState({
            currentRouteId: id,
            editRoute: true,
            createRoute: false,
            coordinates: coordinates,
            defaultLat: Number(coordinates[0].lat),
            defaultLng: Number(coordinates[0].lng)
        })
    }

    render() {
        const returnToRoutes = this.backToAllRoutes;
        const moveFromCreateToEdit = ((id, coordinates) => { this.doneCreatingNew(id, coordinates) });
        if (this.state.createRoute) {
            return (
                <div>
                    <CreateRoute onFinishing={moveFromCreateToEdit} returnToRouteHome={returnToRoutes} />
                </div>);
        }
        else if (this.state.editRoute) {
            return (
                <div>
                    <EditRoute routeId={this.state.currentRouteId} coordinates={this.state.coordinates}
                        returnToRouteHome={returnToRoutes}
                        lat={this.state.defaultLat}
                        lng={this.state.defaultLng}
                        returnToRouteHome={returnToRoutes}
                        />
                </div>
                );
                
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