import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Col, ButtonGroup, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png';


export class EditRoute extends Component {
    constructor(props) {
        super(props);
        
    }

   
    render() {
        return (
            <div>
                <Row>
                    <Col md={6}>
                        <div className="map">
                            <Map google={window.google}
                                initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
                                zoom={12}
                            >
                                

                                <Polyline
                                    strokeWeight={6}
                                    path={this.props.coordinates} 
                                >

                                </Polyline>

                                
                            </Map>

                        </div>
                    </Col>
                    <Col md={3}>
                        
                    </Col>
                </Row>
            </div>

        );
    }

}
export default GoogleApiWrapper({
})(EventMap)

                           