import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, FormControl, ControlLabel, Col, Form, FormGroup, Alert, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { MemberList } from './MemberList';
import { MemberListItem } from './MemberListItem';
import { SearchMembers } from './SearchMembers';
import _ from 'lodash';

export class ViewGroup extends Component {
    constructor(props) {
        super(props);
    
       

    }

  

  

   
    render() {
       
            var membersAdded = this.props.memberNames.map((member,index) => <ListGroupItem key={index} bsStyle='success' >{member}</ListGroupItem>)
       
        
        return (
            <div>
                <Row>
                    <h2>{this.props.name}</h2>
                </Row>
                <Row>
                    <Col md={3}>
                        <h4>{this.props.description}</h4>
                        <h4>{this.props.city}, {this.props.state}</h4>
                        <h4>Organizer: {this.props.owner}</h4>
                        <ButtonToolbar>
                            <Button onClick={this.props.returnToEventHome}>Back</Button>

                        </ButtonToolbar>
                    </Col>
                   

                   
                    <Col md={3}>
                        <ControlLabel>Members </ControlLabel>
                        <ListGroup>
                            {membersAdded}
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        );
    }

}