import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import {GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react'
export class MapContainer extends Component {
    



    render() {
        const style = {
            height: '400px',
            width: '400px'
        }
        return (
            <div style={style}>
                <Map google={window.google}
                    zoom={14}
                    
                >
                    
                </Map>
            </div>
            );
    }
}
export default GoogleApiWrapper({
})(MapContainer)