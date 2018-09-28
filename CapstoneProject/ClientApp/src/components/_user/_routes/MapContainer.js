import React, { Component } from 'react';
import { Button, Well, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonGroup } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, DrawingManager } from 'google-maps-react';
import { SaveRouteModal } from './SaveRouteModal';

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: [{}],
            hasClicked: false,
            updateLine: false,
            distances: [],
            totalDistance: 0,
            elevations: [{up: 0, down: 0}],
            totalElevationGain: 0,
            totalElevationLoss: 0,
            hasElevation: false,
            routeId: null,
            isSavingNew: false
        }

        this.deleteLast = this.deleteLast.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.calculateElevationValues = this.calculateElevationValues.bind(this); 
        this.saveRoute = this.saveRoute.bind(this);
        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    saveRoute() {
        this.setState({
            isSavingNew: true
        })
    }
    handleModalHide() {
        this.setState({
            isSavingNew: false
        })
    }

    async handleSubmit(name, description) {
        let data = {
            name: name,
            description: description,
            
            totalDistance: this.state.totalDistance,
            totalElevationGain: this.state.totalElevationGain,
            totalElevationLoss: this.state.totalElevationLoss,
            userId: localStorage.getItem('userId'),
            coordinates: this.state.coordinates,
            distances: this.state.distances,
            elevations: this.state.elevations

        }
      
       await fetch('/api/Routes/Create',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => {
            let id = data.id;
            this.setState({
                isSavingNew: false,
                routeId: id
            });
            }).catch(error => console.log(error));
        let idToSend = this.state.routeId;
        this.props.onFinishing(idToSend, this.state.coordinates);
    }
    calculateDistanceOnAdd(newCoord, currentPath) {
        var lastCoord = currentPath[currentPath.length - 1];
        let coord1 = new window.google.maps.LatLng(newCoord.lat, newCoord.lng);
        let coord2 = new window.google.maps.LatLng(lastCoord.lat, lastCoord.lng);
        var distance = window.google.maps.geometry.spherical.computeDistanceBetween(coord1, coord2);
        return distance/1609.344;
    }

    getElevationFromGoogle(newCoord, currentPath) {
        var lastCoord = currentPath[currentPath.length - 1];
        let coord1 = new window.google.maps.LatLng(newCoord.lat, newCoord.lng);
        let coord2 = new window.google.maps.LatLng(lastCoord.lat, lastCoord.lng);
        var elevatorService = new window.google.maps.ElevationService;
        return elevatorService.getElevationAlongPath({
            'path': [coord1,coord2],
            'samples': 4
        }, this.calculateElevationValues);
    }

    getElevationChangeForEachPoint(elevations,status) {
        let elevationVals = elevations.map(a => a.elevation.toFixed(4));
        let compare = elevations.map(a => a.elevation.toFixed(4));
        compare.unshift(elevationVals[0]);
        compare.pop();
        let elevationChanges = elevationVals.map((a, i) => {
            return (a - compare[i]).toFixed(4);
        }
        );
        return elevationChanges;
    }

    getPositiveElevationChange(elevationChanges) {
        let positives = elevationChanges.filter(a => a > 0);
        positives = positives.map(a => Number(a));
        let up = positives.reduce((a, b) => a + b, 0);
        return up;
    }

    getNegativeElevationChanges(elevationChanges) {
        let negatives = elevationChanges.filter(a => a < 0);
        negatives = negatives.map(a => Number(a));
        let down = negatives.reduce((a, b) => a + b, 0);
        return down;
    }
    calculateElevationValues(elevations, status) {
        let elevationChanges = this.getElevationChangeForEachPoint(elevations, status);
        let up = this.getPositiveElevationChange(elevationChanges);
        let down = this.getNegativeElevationChanges(elevationChanges);
        let elevationObjects;
        let currentGain = this.state.totalElevationGain;
        let currentLoss = this.state.totalElevationLoss;
        if (this.state.hasElevation === false) {
            elevationObjects = [{ up: up, down: down }]
        }
        else {
            elevationObjects = this.state.elevations;
            elevationObjects.push({ up: up, down: down });
        }
        this.setState({
            elevations: elevationObjects,
            totalElevationGain: currentGain + up,
            totalElevationLoss: currentLoss + down,
            hasElevation: true
        });
    }

   

    addCoordinate(t, map, coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const newCoord = { lat: lat, lng: lng };
        var currentPath = this.state.coordinates;
        var distance = this.calculateDistanceOnAdd(newCoord, currentPath);
        
        if (this.state.hasClicked === false) {
            this.setState({
                coordinates: [newCoord],
                hasClicked: true,
                updateLine: false,
            });
        }
        else {
            this.getElevationFromGoogle(newCoord, currentPath);
            
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
                    totalDistance: 0,
                    elevations: [{ up: 0, down: 0 }],
                    totalElevationGain: 0,
                    totalElevationLoss: 0,
                    hasElevation: false
                });
            }
            else if (this.state.coordinates.length === 2) {
                var currentPath = this.state.coordinates;
                currentPath.pop();
                let currentDistance = this.state.totalDistance;
                let currentDistanceArray = this.state.distances;
                let removed = currentDistanceArray.pop();
                let newDistance = currentDistance - removed;
                let currentElevations = this.state.elevations;
                let removedElevation = currentElevations.pop();
                let currentUp = this.state.totalElevationGain;
                let currentDown = this.state.totalElevationLoss;
                let newUp = currentUp - removedElevation.up;
                let newDown = currentDown - removedElevation.down;
                this.setState({
                    coordinates: currentPath,
                    updateLine: true,
                    totalDistance: newDistance,
                    distances: currentDistanceArray,
                    elevations: currentElevations,
                    totalElevationGain: newUp,
                    totalElevationLoss: newDown,
                    hasElevation: false
                });
            }
            else {
                var currentPath = this.state.coordinates;
                currentPath.pop();
                let currentDistance = this.state.totalDistance;
                let currentDistanceArray = this.state.distances;
                let removed = currentDistanceArray.pop();
                let newDistance = currentDistance - removed;
                let currentElevations = this.state.elevations;
                let removedElevation = currentElevations.pop();
                let currentUp = this.state.totalElevationGain;
                let currentDown = this.state.totalElevationLoss;
                let newUp = currentUp - removedElevation.up;
                let newDown = currentDown - removedElevation.down;
                this.setState({
                    coordinates: currentPath,
                    updateLine: true,
                    totalDistance: newDistance,
                    distances: currentDistanceArray,
                    elevations: currentElevations,
                    totalElevationGain: newUp,
                    totalElevationLoss: newDown
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
                distances: [],
                elevations: [{ up: 0, down: 0 }],
                totalElevationGain: 0,
                totalElevationLoss: 0,
                hasElevation: false
            });
            
        }
    }

    render() {
        const submitRoute = ((name,description) => { this.handleSubmit(name,description) });

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
        var uphill;
        var downhill;
        if (this.state.hasElevation === true) {
            uphill = this.state.elevations[this.state.elevations.length - 1].up.toFixed(2);
            downhill = this.state.elevations[this.state.elevations.length - 1].down.toFixed(2);
        
        }
        else {
            uphill = 0;
            downhill = 0;
        }
        
            return (
                <Row>
                    <Col md={7}>
                        <SaveRouteModal show={this.state.isSavingNew} hiding={this.handleModalHide} submitting={submitRoute} />

                        <div className='map'>
                            <Map google={window.google}
                                initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
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
                            <Button onClick={this.saveRoute} disabled={!(this.state.totalDistance > 0)}>Save</Button>
                        </ButtonGroup>

                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <ControlLabel>Total Distance</ControlLabel>
                            <Well>{this.state.totalDistance.toFixed(3)} miles</Well>
                            <ControlLabel>Total Elevation Gain</ControlLabel>
                            <Well>{this.state.totalElevationGain.toFixed(2)} meters</Well>
                            <ControlLabel>Total Elevation Loss</ControlLabel>
                            <Well>{this.state.totalElevationLoss.toFixed(2)} meters</Well>
                            <ControlLabel>Uphill on Last Stretch</ControlLabel>
                            <Well>{uphill} meters</Well>
                            <ControlLabel>Downhill on Last Stretch</ControlLabel>
                            <Well>{downhill} meters</Well>
                        </FormGroup>
                    </Col>
                </Row>
            );
        }
       
    
}
export default GoogleApiWrapper({
})(MapContainer)