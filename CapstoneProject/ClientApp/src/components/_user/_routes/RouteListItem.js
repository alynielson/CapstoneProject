import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';



export class RouteListItem extends Component {
    constructor(props) {
        super(props);

    }

  


    render() {
        const routeToAdd = { key: this.props.value, value: this.props.value, display: this.props.display };
        return (
            <ListGroupItem  onClick={() => this.props.onRouteSelect(routeToAdd)}>

                {this.props.display}



            </ListGroupItem>
        );



    }

}