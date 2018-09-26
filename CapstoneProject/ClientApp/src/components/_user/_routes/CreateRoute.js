import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { MapContainer } from './MapContainer';

export class CreateRoute extends Component {
    

    constructor(props) {
        super(props);

    }

    





    render() {
        return (
            <div>
                <Row>
                <Col md={8} className="map-container">
                    <MapContainer />  
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <ButtonToolbar className='map-buttons'>
                            <Button  onClick={this.props.returnToRouteHome}>Back</Button>
                            <Button>Finish</Button>
                        </ButtonToolbar>
                        </Col>
                </Row>
            </div>
            
            
            
            );




    }
}