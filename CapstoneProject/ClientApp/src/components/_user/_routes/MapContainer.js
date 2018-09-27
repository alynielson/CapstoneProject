import React, { Component } from 'react';
import { Button, Well, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonGroup } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, DrawingManager } from 'google-maps-react'


export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: [{}],
            hasClicked: false,
            updateLine: false,
            distances: [],
            totalDistance: 0
        }

        this.deleteLast = this.deleteLast.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
    }

    calculateDistanceOnAdd(newCoord, currentPath) {
        var lastCoord = currentPath[currentPath.length - 1];
        let coord1 = new window.google.maps.LatLng(newCoord.lat, newCoord.lng);
        let coord2 = new window.google.maps.LatLng(lastCoord.lat, lastCoord.lng);
        var distance = window.google.maps.geometry.spherical.computeDistanceBetween(coord1, coord2);
        return distance/1609.344;
    }

    addCoordinate(t, map, coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const newCoord = { lat: lat, lng: lng };
        var currentPath = this.state.coordinates;
        var distance = this.calculateDistanceOnAdd(newCoord, currentPath );
        if (this.state.hasClicked === false) {
            this.setState({
                coordinates: [newCoord],
                hasClicked: true,
                updateLine: false,
               
            });
        }
        else {
            var currentDistanceArray = this.state.distances;
            var currentTotal = this.state.totalDistance + distance;
            currentDistanceArray.push(distance);
            var newPath = currentPath.concat(newCoord);
            this.setState({
                coordinates: newPath,
                updateLine: false,
                distances: currentDistanceArray,
                totalDistance: currentTotal
            })
        }
    }

   

   deleteLast() {
        if (this.state.hasClicked === true) {
            if (this.state.coordinates.length === 1) {
                this.setState({
                    coordinates: [{}],
                    hasClicked: false,
                    distances: [],
                    totalDistance: 0

                });
            }
            else {
                var currentPath = this.state.coordinates;
                currentPath.pop();
                let currentDistance = this.state.totalDistance;
                let currentDistanceArray = this.state.distances;
                let removed = currentDistanceArray.pop();
                let newDistance = currentDistance - removed;
                this.setState({
                    coordinates: currentPath,
                    updateLine: true,
                    totalDistance: newDistance,
                    distances: currentDistanceArray
                });
            }
        }
    }

    
    deleteAll() {
        if (this.state.hasClicked === true) {
            this.setState({
                coordinates: [{}],
                hasClicked: false,
                totalDistance: 0,
                distances: []
            });
            
        }
    }

    render() {
        var polyline;
        if (this.state.hasClicked == false) {
            polyline = null
        }
        else if (this.state.updateLine === true) {
            polyline = <Polyline path={this.state.coordinates} />
        }
        else if (this.state.hasClicked === true) {
            polyline = <Polyline path={this.state.coordinates} />
        }
        
        return (    
            <Row>
                <Col md={7}>
            <div className='map'>
                        <Map google={window.google}
                            center={{ lat: this.props.lat, lng: this.props.lng }}
                            zoom={14}
                            onClick={(t, map, coord) => this.addCoordinate(t, map, coord)}
                >
                            {polyline}
                            
                </Map>
                    </div>
                </Col>
                <Col md={2}>
            <ButtonGroup vertical>
                                <Button onClick={this.deleteLast}>Undo</Button>
                                <Button onClick={this.deleteAll}>Clear All</Button>
                            </ButtonGroup>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <ControlLabel>Distance</ControlLabel>
                        <Well>{this.state.totalDistance.toFixed(3)} miles</Well>
                    </FormGroup>
                    </Col>
                </Row>
            );
    }
}
export default GoogleApiWrapper({
})(MapContainer)