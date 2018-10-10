import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';


export class RouteInfo extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            route1Details: '',
            route2Details: ''
        }
    }

    handleChange(event, number) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        this.props.onDetailsChanging(value, number);
    }
   
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
        if (this.props.hasFinished) {
            detailsToShow = <FormGroup>
                Event Details for this Route: {` ${details}`}
            </FormGroup>
        }
        else if (this.props.hasSelected){
            switch (this.props.routeShowing.routeSpot) {
                case (1):
                    detailsToShow = <FormGroup>
                        <FormControl placeholder="Event Details for this Route"type='textarea' value={this.state.route1Details} name="route1Details" onChange={(event, number) => this.handleChange(event, 1)} />
                    </FormGroup>
                    break;
                case (2):
                    detailsToShow = <FormGroup>
                        <FormControl placeholder="Event Details for this Route"type='textarea' value={this.state.route2Details} name="route2Details" onChange={(event, number) => this.handleChange(event, 2)} />
                    </FormGroup>
            }
        }
        routeShowing = <div style={this.props.style}>
            <h4> {title}: {route.name}</h4>
            <FormGroup>
                Distance: {Number(route.totalDistance).toFixed(2)} miles
                </FormGroup>
            <FormGroup>
                Total Elevation Gain: {Number(route.totalElevationGain).toFixed(2)} meters
                </FormGroup>
            <FormGroup>
                Total Elevation Loss: {Number(route.totalElevationLoss).toFixed(2)} meters
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

} export default RouteInfo;