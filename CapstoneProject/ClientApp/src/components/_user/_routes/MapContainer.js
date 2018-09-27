import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonGroup } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, DrawingManager } from 'google-maps-react'


export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: [{}],
            hasClicked: false,
            updateLine: false
        }

        this.deleteLast = this.deleteLast.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
    }

    addCoordinate(t, map, coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const newCoord = { lat: lat, lng: lng };
        var currentPath = this.state.coordinates;
        if (this.state.hasClicked === false) {
            this.setState({
                coordinates: [newCoord],
                hasClicked: true,
                updateLine: false
            });
        }
        else {
            var newPath = currentPath.concat(newCoord);
            this.setState({
                coordinates: newPath,
               updateLine: false
            })
        }
    }

   

   deleteLast() {
        if (this.state.hasClicked === true) {
            if (this.state.coordinates.length === 1) {
                this.setState({
                    coordinates: [{}],
                    hasClicked: false,
                    
                    
                });
            }
            var currentPath = this.state.coordinates;
            currentPath.pop();
            this.setState({
                coordinates: currentPath,
                updateLine: true
            });
        }
    }

    
    deleteAll() {
        if (this.state.hasClicked === true) {
            this.setState({
                coordinates: [{}],
                hasClicked: false,
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
                <Col md={10}>
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
                </Row>
            );
    }
}
export default GoogleApiWrapper({
})(MapContainer)