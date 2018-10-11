import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class StravaData extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.route2 !== null) {
            fetch(`/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}&time=${this.props.time}&lat1=${this.props.route1.coordinates[0].lat}&lng1=${this.props.route1.coordinates[0].lng}&lat2=${this.props.route2.coordinates[0].lat}&lng2=${this.props.route2.coordinates[0].lng}`).then(response => response.json())
                .then(data => console.log(data)).catch(error => console.log(error));
        }
        else {
            fetch(`/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}&time=${this.props.time}&lat1=${this.props.route1.coordinates[0].lat}&lng1=${this.props.route1.coordinates[0].lng}`).then(response => response.json())
                .then(data => console.log(data)).catch(error => console.log(error));
        }
    }

   
    render() {
        return (
            <div> No Results Yet</div>
            
            );
    }



}