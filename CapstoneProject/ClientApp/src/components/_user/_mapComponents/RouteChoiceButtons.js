import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class RouteChoiceButtons extends Component{
    isRoute(route) {
        return (route === this.props.routeShowing.routeSpot);
    }
    render() {
        var finalRoutes = null;
        if (this.props.routesViewing > 1) {
            finalRoutes = <ButtonToolbar>
                <Button className="normal-buttons btn" onClick={(routeNumber) => this.props.viewRoute(1)} active={this.isRoute(1)}>Route A</Button>
                <Button className="normal-buttons btn"onClick={(routeNumber) => this.props.viewRoute(2)} active={this.isRoute(2)}>Route B</Button>
            </ButtonToolbar>
        }
        return (finalRoutes);
    }
} export default RouteChoiceButtons;