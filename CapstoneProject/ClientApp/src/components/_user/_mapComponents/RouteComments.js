import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class RouteComments extends Component{

    render() {
        let pointAlert = null;
        let pathAlert = null;
        if (this.props.comments[0].comment != null) {
            pointAlert = <Alert className="custom-comment"onDismiss={this.props.dismissPointComment}>
                <h5>{this.props.comments[0].author}</h5>
                <p> {this.props.comments[0].comment} </p> </Alert>
        }
        if (this.props.comments[1].comment != null) {
            pathAlert = <Alert className="custom-comment" onDismiss={this.props.dismissPathComment}>
                <h5>{this.props.comments[1].author}</h5>
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