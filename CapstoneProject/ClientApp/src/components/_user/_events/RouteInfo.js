import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';


export class RouteInfo extends Component {
   
render() {
    var routeShowing = null;
    let route;
    let title;
    let details;
    let detailsToShow = null;
    if (this.props.routeShowing.values === true) {
        switch (this.props.routeShowing.routeSpot) {
            case (1): route = this.props.route1;
                title = "Route A";
                details = this.props.hasSelected ? this.props.route1Details : null;
                break;
            case (2): route = this.props.route2;
                title = "Route B";
                details = this.props.hasSelected ? this.props.route2Details : null;
                break;
        }
        if (this.props.hasSelected) {
            detailsToShow = <FormGroup>
                <ControlLabel>Event Details for this Route</ControlLabel>
                {details}
            </FormGroup>
        }
        routeShowing = <div>
            <h4> {title}: {route.name}</h4>
            <FormGroup>
                <ControlLabel>Distance:</ControlLabel>  {Number(route.totalDistance).toFixed(2)} miles
                </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(route.totalElevationGain).toFixed(2)} meters
                </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(route.totalElevationLoss).toFixed(2)} meters
                </FormGroup>
            {detailsToShow}
        </div>
    } 
        return (
               <div>
            { routeShowing}
            </div>
            );
    }






}