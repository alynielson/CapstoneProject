﻿import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ListGroupItem, ListGroup, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { NavMenu } from '../NavMenu';
import { SearchMembers } from './_groups/SearchMembers';
import { MemberList } from './_groups/MemberList';
import _ from 'lodash';
export class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupId: null,
            userId: null,
            name: '',
            city: '',
            state: '',
            states: [],
            description: '',
            members: [],
            membersToAdd: []
        }
        this.handleChange = this.handleChange.bind(this);
        

    }
  

    addSelectedMember(selectedMember) {
        let currentMembers = this.state.members.map(a => a.value).slice();
        let selectedExist = currentMembers.indexOf(selectedMember.value);
        if (selectedExist === -1) {
            let editableMembers = this.state.members.slice();
            editableMembers.push(selectedMember);
            this.setState({
                members: editableMembers
            });
        }
        else {
            let editableMembers = this.state.members.slice();
            editableMembers.splice(selectedExist, 1);
            this.setState({
                members: editableMembers
            })
        }
        
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    componentDidMount() {
        fetch("api/Users/GetStatesList")
            .then(response => { return response.json(); })
            .then(data => {
                let statesToSelect = data.map(state => { return { value: state, display: state } });
                this.setState({ states: [{ value: '', display: '' }].concat(statesToSelect) });
            })
            .catch(error => console.log(error));

    }
   

    searchTest(term2) {
        let terms = term2.toString().trim().toLowerCase().replace(/[^A-Za-z0-9\s]/g, "");
        let url = `/api/Users/UniversalUserSearch?term1=${terms}`;
        fetch(url).then(response => response.json())
            .then(jsonData => {
                let membersToSelect = jsonData.map(member => { return { value: member.id, display: `${member.name} - ${member.location}` } });
                this.setState({ membersToAdd: membersToSelect });
            })
            .catch(error => console.log(error));
    }

    render() {
        const membersAdded = this.state.members.map((member) => <ListGroupItem key={member.value} bsStyle='success'>{member.display}</ListGroupItem>)
        const memberSearch = _.debounce((term2) => { this.searchTest(term2) }, 1000);
        const addMember = ((selectedMember) => { this.addSelectedMember(selectedMember) });
        if (this.state.groupId === null) {
            return (
                <div>
                    <h1> New Group </h1>
                    <Row>
                        <Col md={3}>
                            
                            <Form>
                                <FormGroup>
                                    <ControlLabel>Group Name</ControlLabel>
                                    <FormControl

                                        type="text"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>City</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="city"
                                        value={this.state.city}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <ControlLabel>State</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    name="state"
                                    value={this.state.state}
                                    onChange={this.handleChange}
                                >
                                    {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}
                                </FormControl>
                                <FormGroup>
                                    <ControlLabel>Description</ControlLabel>
                                    <FormControl
                                        componentClass="textarea"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleChange} />
                                    
                                </FormGroup>

                            </Form>
                        </Col>
                        <Col md={3}>
                            
                                <SearchMembers onSearchEnter={memberSearch}/>
                            <MemberList membersToAdd={this.state.membersToAdd}
                                onMemberSelect={addMember} existingMembers={this.state.members} />
                        </Col>
                        <Col md={3}>
                            <ControlLabel>Added Members </ControlLabel>
                            <ListGroup>
                                {membersAdded}
                                </ListGroup>
                        </Col>
                    </Row>

                </div>
            );


        }
        else {
            return (
                <div>
                created
                
                </div>
                );
        }


       



    }


}