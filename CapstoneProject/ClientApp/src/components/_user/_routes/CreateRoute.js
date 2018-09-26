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
                <Col md={8}>
                        <MapContainer />
                       
                </Col> <ButtonToolbar>
                            <Button onClick={this.props.returnToRouteHome}>Back</Button>
                            <Button>Finish</Button>
                        </ButtonToolbar>
            </div>
            
            
            
            );




    }
}