import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, DrawingManager } from 'google-maps-react'


export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineCoordinates: []
        }
        this.initMap = this.initMap.bind(this);
    }

   



    initMap(mapProps, map) {
        var self = this;
        const { google } = mapProps;
        

        const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: 'polyline',
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYLINE,
                ]
            },
            map: map
        });
    }


    render() {
        
        return (
            <div className='map'>
                <Map google={window.google}
                    onReady={this.initMap}
                    center={{ lat: this.props.lat, lng: this.props.lng }}
                    zoom={14}
                    onClick={this.addPoint}
                >

                </Map>
            </div>
            );
    }
}
export default GoogleApiWrapper({
})(MapContainer)