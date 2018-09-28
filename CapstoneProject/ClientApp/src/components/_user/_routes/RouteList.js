import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { RouteListItem } from './RouteListItem';


export class RouteList extends Component {
    constructor(props) {
        super(props);


    }


    render() {
        const listItems = this.props.routesToAdd.map((route) => {
            return (<RouteListItem onRouteSelect={this.props.onRouteSelect} key={route.value} value={route.value} display={route.display}></RouteListItem>
            )
        });
        return (
            <ListGroup>
                {listItems}
            </ListGroup>

        );
    }





}