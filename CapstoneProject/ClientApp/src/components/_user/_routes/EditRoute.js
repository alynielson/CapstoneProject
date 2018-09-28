import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, DrawingManager } from 'google-maps-react';

export class EditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }

    }

    render() {
        return (
            <div>Editing route
                <Row>
                    <Col md={7}>
                    <div className="map">
                        <Map google={window.google}
                            initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
                            zoom={12}
                        >
                            <Polyline path={this.props.coordinates} />
                        </Map>
                        </div>
                       </Col>
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