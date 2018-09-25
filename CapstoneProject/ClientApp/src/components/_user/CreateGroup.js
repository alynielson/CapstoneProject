import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { NavMenu } from '../NavMenu';
import { SearchMembers } from './_groups/SearchMembers';
import { MemberList } from './_groups/MemberList';
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
    componentDidMount() {
        fetch("api/Users/GetStatesList")
            .then(response => { return response.json(); })
            .then(data => {
                let statesToSelect = data.map(state => { return { value: state, display: state } });
                this.setState({ states: [{ value: '', display: '' }].concat(statesToSelect) });
            })
            .catch(error => console.log(error));
        this.setState({ userId:  localStorage.getItem('userId') } );
    }

    addSelectedMember(selectedMember) {
        let currentMembers = this.state.members.slice();
        currentMembers.push(selectedMember);
        this.setState({
            members: currentMembers
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async searchForMember(filter, term1 = null, term2 = null, term3 = null, term4 = null) {
        let url;
        if (filter === 'name') {
            url = `/api/Users/SearchUsersByName?first_name=${term1}&last_name=${term2}`;
        }
        else if (filter === 'location') {
            url = `/api/Users/SearchUsersByLocation?city=${term1}&state=${term2}`;
        }
        else {
            url = `/api/Users/SearchUsersByAll?city=${term1}&state=${term2}&first_name=${term3}&last_name=${term4}`;
        }
        await fetch(url).then(response => response.json())
            .then(jsonData => {
                let membersToSelect = jsonData.map(member => { return { value: member.id, display: `${member.name} - ${member.location}` } });
                this.setState({ membersToAdd: membersToSelect });
            })
            .catch(error => console.log(error));
    }

    render() {
        const memberSearch = ((filter, term1, term2, term3, term4) => this.searchForMember(filter, term1, term2, term3, term4));
        const addMember = ((selectedMember) => this.addSelectedMember(selectedMember));
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
                            
                        </Col>
                        <Col md={3}>
                            <MemberList membersToAdd={this.state.membersToAdd}
                                onMemberSelect={addMember} />
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