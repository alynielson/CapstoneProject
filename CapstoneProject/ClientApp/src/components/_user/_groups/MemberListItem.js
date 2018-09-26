import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';



export class MemberListItem extends Component {
    constructor(props) {
        super(props);

    }

    isActive() {
        const existingMembers = this.props.existingMembers.map(a => a.value);
        const thisMember = this.props.value;
        if (existingMembers.includes(thisMember)) {
            return true;
        }
        else {
            return false;
        }
    }


    render() {
        const memberToAdd = { key: this.props.value, value: this.props.value, display: this.props.display };
        return (
            <ListGroupItem active={this.isActive()} onClick={() => this.props.onMemberSelect(memberToAdd)}>
                
                        {this.props.display}
                   
                     
                    
            </ListGroupItem>
            );



    }

}