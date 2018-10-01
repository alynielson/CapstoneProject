import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';


export class RouteInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            routeShowing: 1
        }
    }
    viewRouteA() {
        this.setState({
            routeShowing: 1
        })
    }
    viewRouteB() {
        this.setState({
            routeShowing: 2
        })
    }
    isRouteA() {
        return this.state.routeShowing === 1;
    }
render() {
    var finalRoutes = null;
    if (this.props.route2 !== null) {
        finalRoutes = <ButtonToolbar>
            <Button onClick={() => this.viewRouteA()} active={this.isRouteA()}>Route A</Button>
            <Button onClick={() => this.viewRouteB()} active={!this.isRouteA()}>Route B</Button>
        </ButtonToolbar>
    }
    var routeShowing = null;
    if (this.state.routeShowing === 2) {
        routeShowing = <div>
            <h4> Route B: {this.props.route2.name}</h4>
            <FormGroup>
                <ControlLabel>Distance:</ControlLabel>  {Number(this.props.route2.totalDistance).toFixed(2)} miles
                </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(this.props.route2.totalElevationGain).toFixed(2)} meters
                </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(this.props.route2.totalElevationLoss).toFixed(2)} meters
                </FormGroup>
            <FormGroup>
                <ControlLabel>Event Details for this Route</ControlLabel>
                {this.props.route2Details}
            </FormGroup>
        </div>
    } else {
        routeShowing = <div>
            <h4> Route A: {this.props.route1.name}</h4>
            <FormGroup>
                <ControlLabel>Distance:</ControlLabel>  {Number(this.props.route1.totalDistance).toFixed(2)} miles
            </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(this.props.route1.totalElevationGain).toFixed(2)} meters
            </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(this.props.route1.totalElevationLoss).toFixed(2)} meters
            </FormGroup>
            <FormGroup>
                <ControlLabel>Event Details for this Route</ControlLabel>
                {this.props.route1Details}
            </FormGroup>
        </div>

    }
        return (
               <div>
            { finalRoutes }
            { routeShowing}
            </div>
            
            
            
            
            
            
            
            );
    }






}