import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ListGroupItem, ListGroup, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { NavMenu } from '../NavMenu';
import { SearchMembers } from './_groups/SearchMembers';
import { MemberList } from './_groups/MemberList';
import _ from 'lodash';

export class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            city: '',
            state: '',
            states: [],
            description: '',
            members: [],
            membersToAdd: [],
            errorMessage: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitGroup = this.submitGroup.bind(this);

    }

    async submitGroup(event) {
        event.preventDefault();
        if (!this.canSubmit()) {
            this.setState({ errorMessage: "Can't create without a name and description!" });
        }
        else {
            var userId = localStorage.getItem('userId');
            var members = this.state.members.map(a => Number(a.value));
            const data = {
                name: this.state.name, city: this.state.city, state: this.state.state, description: this.state.description,
                members: members, userId: userId
            };
            await fetch('api/Groups/Create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(error => console.log(error));
            this.props.returnToEventHome();
        }
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

    canSubmit() {
        return this.state.name !== '' && this.state.description !== '';
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
        const membersAdded = this.state.members.map((member) => <ListGroupItem key={member.value}>{member.display}</ListGroupItem>)
        const memberSearch = _.debounce((term2) => { this.searchTest(term2) }, 1000);
        const addMember = ((selectedMember) => { this.addSelectedMember(selectedMember) });
        const style = {
            backgroundColor: "purple",
            height: "85vh",
        };
        const membersBox = {
            backgroundColor: "#c2e6ff",
            height: "60vh",
            paddingLeft: "30px",
            paddingRight: "30px",
            color: "#555",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px"
        }
            return (
                <div style={style}>
                    <Row className="empty-space2percent" />
                    <Row>
                        <Col md={2} mdOffset={1}>
                            <h1 className="page-subtitle"> New Group </h1>
                            </Col>
                        </Row>
                    <Row>
                        <Col md={3} mdOffset={1}>
                            <div hidden={this.state.errorMessage === ''}>
                                <Alert>{this.state.errorMessage}</Alert>
                                </div>
                            <Form>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Group Name"
                                        type="text"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Description"
                                        componentClass="textarea"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleChange} />

                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        placeholder="City"
                                        type="text"
                                        name="city"
                                        value={this.state.city}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormControl
                                    componentClass="select"
                                    name="state"
                                    value={this.state.state}
                                    onChange={this.handleChange}
                                >
                                    {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}
                                </FormControl>
                                

                            </Form>
                       
                        </Col>
                        <Col md={3}>
                            
                                <SearchMembers onSearchEnter={memberSearch}/>
                            <MemberList membersToAdd={this.state.membersToAdd}
                                onMemberSelect={addMember} existingMembers={this.state.members} />
                        </Col>
                        <Col md={4}>
                            <div style={membersBox}>
                                <h3>Members Added</h3>
                            <ListGroup>
                                {membersAdded}
                                </ListGroup>
                                </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={1} mdOffset={1}>
                                <a className="smaller-action-buttons" onClick={this.props.returnToEventHome}>Back</a>
                        </Col>
                        <Col md={2}>
                            <a className="btn action-button" onClick={(event) => this.submitGroup(event)}>Finish</a>

                            </Col>
                        </Row>

                </div>
            );


        }
      


       



    


}