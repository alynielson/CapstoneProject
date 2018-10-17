import React, { Component } from 'react';
import { Button, Tooltip, OverlayTrigger, Alert, Col, ButtonGroup, Row, FormGroup} from 'react-bootstrap';

export class RouteInfo extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        const infoBox = {
            backgroundColor: "#c2e6ff",
            marginTop: "10px",
            paddingLeft: "15px",
            paddingRight: "15px",
            paddingTop: "15px",
            paddingBottom: "10px",
            marginLeft: "-30px",
            marginRight: "-30px",
            color: "#555",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px"
        }
        return (
            <div style={infoBox}>
                <FormGroup>
                    Distance: {Number(this.props.totalDistance).toFixed(2)} miles
                </FormGroup>
                <FormGroup>
                    Total Elevation Gain: {Number(this.props.totalElevationGain).toFixed(2)} meters
                </FormGroup>
                <FormGroup>
                    Total Elevation Loss: {Number(this.props.totalElevationLoss).toFixed(2)} meters
                </FormGroup>
            </div>
            );
    }
}