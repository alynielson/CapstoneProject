import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';



export class MemberListItem extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        const memberToAdd = this.props.value;
        return (
            <ListGroupItem onClick={() => this.props.onMemberSelect(memberToAdd)}>
                
                        {this.props.display}
                   
                     
                    
            </ListGroupItem>
            );



    }

}