import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class RouteComments extends Component{

    render() {
        let pointAlert = null;
        let pathAlert = null;
        let style = null;
        if (this.props.createEvent) {
            style = {
                marginTop: "-30px",
            paddingBottom: "100px",
            paddingTop: "5px",
                marginLeft: "-10px",
                marginRight: "5px",
            marginBottom: "40px"
            }
        }
        if (this.props.comments[0].comment != null) {
            pointAlert = <Alert className="custom-comment" style={style}onDismiss={this.props.dismissPointComment}>
                <h5>{this.props.comments[0].author}</h5>
                <p> {this.props.comments[0].comment} </p> </Alert>
        }
        if (this.props.comments[1].comment != null) {
            pathAlert = <Alert className="custom-comment" style={style}onDismiss={this.props.dismissPathComment}>
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