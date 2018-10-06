import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class RouteComments extends Component{

    render() {
        let pointAlert = null;
        let pathAlert = null;
        if (this.props.comments[0].comment != null) {
            pointAlert = <Alert bsStyle="info" onDismiss={this.props.dismissPointComment}>
                <h4>{this.props.comments[0].author}</h4>
                <p> {this.props.comments[0].comment} </p> </Alert>
        }
        if (this.props.comments[1].comment != null) {
            pathAlert = <Alert bsStyle="success" onDismiss={this.props.dismissPathComment}>
                <h4>{this.props.comments[1].author}</h4>
                <p> {this.props.comments[1].comment} </p> </Alert>
        }
        return (
            <div>
                {pointAlert}
                {pathAlert}
            </div>
            );
    }


} export default RouteComments;