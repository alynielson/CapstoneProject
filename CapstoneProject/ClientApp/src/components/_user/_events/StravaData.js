import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class StravaData extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        fetch(`/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}`).then(response => response.json())
            .then(data => console.log(data)).catch(error => console.log(error));
    }

   
    render() {
        return (
            <div> Strava Data</div>
            
            );
    }



}