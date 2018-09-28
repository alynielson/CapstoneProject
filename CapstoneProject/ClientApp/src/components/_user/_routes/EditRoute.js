import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, DrawingManager } from 'google-maps-react';

export class EditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            city: '',
            state: '',
            description: '',
            owner: '',
            totalDistance: '',
            totalElevationGain: '',
            totalElevationLoss: '',
            coordinates: [{}],
            hasCoordinates: false
        }

    }

    
    async componentDidMount() {
        let name;
        let city;
        let state;                    
        let description;
        let owner;
        let totalDistance;
        let totalElevationGain;
        let totalElevationLoss;
        let coordinates;
        let hasCoordinates;
       
       await fetch(`/api/Routes/GetRoute?id=${this.props.id}`).then(response => response.json())
            .then(data => {
                name = data.name;
                city = data.city;
                state = data.state;
                description = data.description;
                owner = data.ownerName;
                totalDistance = data.totalDistance;
                totalElevationGain = data.totalElevationGain;
                totalElevationLoss = data.totalElevationLoss;
                coordinates = data.coordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
                this.setState({
                    name: name,
                    city: city,
                    state: state,
                    description: description,
                    owner: owner,
                    totalDistance: totalDistance,
                    totalElevationGain: totalElevationGain,
                    totalElevationLoss: totalElevationLoss,
                    coordinates: coordinates,
                    hasCoordinates: true
                });
            }
        ).catch(error => console.log(error));

        console.log(coordinates);
    }

    render() {
        var polyline;
        if (this.state.hasCoordinates === false) {
            polyline = null;
        }
        else {
            polyline = <Polyline path={this.state.coordinates} />
        }
        return (
            <div>Editing route
                <Row>
                    <div className="map">
                    <Map google={window.google}>

                            {polyline}

                        </Map>
                        </div>
                </Row>
                <Row>
                <ButtonToolbar className='map-buttons'>
                    <Button onClick={this.props.returnToRouteHome}>Back</Button>

                    </ButtonToolbar>
                    </Row>
                </div>
            
            );
        }
    
  }  
export default GoogleApiWrapper({
                })(EditRoute)