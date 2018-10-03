import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { CreateMapContainer } from '../_mapComponents/CreateMapContainer';

export class CreateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultLat: 43.0362012,
            defaultLong: -87.98582829999999,
        }
    }

    componentWillMount() {
        const userId = localStorage.getItem('userId');
        let lat;
        let lng;
        fetch(`api/Users/GetDefaultMapCoordinates?userId=${userId}`).then(response => response.json())
            .then(data => {
                lat = Number(data.lat);
                lng = Number(data.lng);
                this.setState({
                    defaultLat: lat,
                    defaultLong: lng
                });
            }).catch(error => console.log(error));
    }

    render() {
        return (
            <div>
                <Row>
                <Col md={12} className="map-container">
                    <CreateMapContainer onFinishing={this.props.onFinishing} lat={this.state.defaultLat} lng={this.state.defaultLong}/>  
                </Col>
                </Row>
                <Row>
                    <ButtonToolbar className='map-buttons'>
                        <Button  onClick={this.props.returnToRouteHome}>Back</Button>  
                    </ButtonToolbar>
                </Row>
            </div>
            );
    }
}