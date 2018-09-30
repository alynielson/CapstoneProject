import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, FormControl, ControlLabel, Col, Form, FormGroup, Alert, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { MemberList } from './MemberList';
import { MemberListItem } from './MemberListItem';
import { SearchMembers } from './SearchMembers';
import _ from 'lodash';

export class EditGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            states: [],
            membersToAdd: [],
            newMembers: []
        }
        this.handleChange = this.handleChange.bind(this);

    }

    async submitEdit() {
        var data = {
            groupId: this.props.id,
            name: this.state.name,
            description: this.state.description,
            city: this.state.city,
            state: this.state.state,
            members: this.state.newMembers.map(a => a.value)
        }
        await fetch('/api/Groups/EditGroup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(error => console.log(error));

        this.props.returnToEventHome();
    }

    addSelectedMember(selectedMember) {
        let currentNewMembers = this.state.newMembers.map(a => a.value).slice();
        let selectedExist = currentNewMembers.indexOf(selectedMember.value);
        let currentOldMembers = this.state.members.map(a => a.value).slice();
        let selectedOldExist = currentOldMembers.indexOf(selectedMember.value);
        if (selectedExist === -1 && selectedOldExist === -1) {
            let editableMembers = this.state.newMembers.slice();
            editableMembers.push(selectedMember);
            this.setState({
                newMembers: editableMembers
            });
        }
        else {
            let editableMembers = this.state.newMembers.slice();
            editableMembers.splice(selectedExist, 1);
            this.setState({
                newMembers: editableMembers
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
    componentWillMount() {
        fetch("api/Users/GetStatesList")
            .then(response => { return response.json(); })
            .then(data => {
                let statesToSelect = data.map(state => { return { value: state, display: state } });
                this.setState({
                    states: [{ value: '', display: '' }].concat(statesToSelect),
                    members: this.props.memberIds.map((a, i) => {
                        return (
                            {
                                value: a,
                                display: this.props.memberNames[i]
                            }
                            );
                    }),
                    name: this.props.name,
                    city: this.props.city,
                    state: this.props.state,
                    description: this.props.description
                   
                });
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
    checkForExistingMembers() {
        let fromDBMembers = this.state.members;
        let newMembers = this.state.newMembers;
        return fromDBMembers.concat(newMembers);
    }
    deleteMember(index) {
        let memberToDelete = this.state.members[index];
        let memberId = memberToDelete.value;
        let groupId = this.props.id;
        fetch(`api/Groups/DeleteMember?userId=${memberId}&groupId=${groupId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).catch(error => console.log(error));
        let currentMembers = this.state.members;
        currentMembers.splice(index, 1);
        this.setState({
            members: currentMembers
        })
    }
    render() {
        if (this.state.members !== undefined) {
            var membersAdded = this.state.members.map((member, index) => <Alert key={member.value} bsStyle='success' onDismiss={() => this.deleteMember(index)}>{member.display}</Alert>)
        } else { membersAdded = null;}
        var newMembers = this.state.newMembers.map((member) => <ListGroupItem key={member.value} bsStyle='success'>{member.display}</ListGroupItem>)

       
            const memberSearch = _.debounce((term2) => { this.searchTest(term2) }, 1000);
        const addMember = ((selectedMember) => { this.addSelectedMember(selectedMember) });
        return (
            <div>
            <Row>
                <h2>Edit Group</h2>
                </Row>
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
                    <ButtonToolbar>
                            <Button onClick={(event) => this.submitEdit(event)}>Back</Button>
                        
                    </ButtonToolbar>
                </Col>
                <Col md={3}>

                    <SearchMembers onSearchEnter={memberSearch} />
                    <MemberList membersToAdd={this.state.membersToAdd}
                        onMemberSelect={addMember} existingMembers={this.checkForExistingMembers()} />
                    </Col>

                    <Col md={3}>
                        <ControlLabel>Members To Add</ControlLabel>
                        <ListGroup>{newMembers}</ListGroup>
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