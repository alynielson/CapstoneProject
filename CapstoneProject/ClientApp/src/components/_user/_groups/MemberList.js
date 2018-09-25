import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { MemberListItem } from './MemberListItem';


export class MemberList extends Component {
    constructor(props) {
        super(props);


    }


    render() {
        const listItems = this.props.membersToAdd.map((member) => {
            return (<MemberListItem onMemberSelect={this.props.onMemberSelect} key={member.value} value={member.value} display={member.display}></MemberListItem>
        )} );
        return (
            <ListGroup>
                {listItems}
            </ListGroup>

        );
    }





}