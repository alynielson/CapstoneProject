﻿import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { GroupItem } from '../_groups/GroupItem';

import 'react-datepicker/dist/react-datepicker.css';

export class SelectGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            startTime: moment(),
            name: '',
            description: '',
            groups: [],
            selectedGroups: []
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.chooseButton1 = this.chooseButton1.bind(this);
        this.chooseButton2 = this.chooseButton2.bind(this);
        
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId');
        fetch(`api/Groups/GetGroups?id=${userId}`).then(response => response.json()).then(data => {
            let groups = data.groupsIn.concat(data.groupsOwn).map(a => { return ({ id: a.id, name: a.name }); });
            this.setState({
                groups: groups
            });
        }
        ).catch(a => console.log(a));

    }

    chooseButton1() {
        this.setState({
            numberOfRoutes: 1
        })
    }
    chooseButton2() {
        this.setState({
            numberOfRoutes: 2
        })
    }

    addGroup(index) {
        let currentGroups = this.state.selectedGroups.map(a => a.id).slice();
        let selectedExist = currentGroups.indexOf(this.state.groups[index].id);
        if (selectedExist === -1) {
            let currentlySelected = this.state.selectedGroups.slice();
            currentlySelected.push(this.state.groups[index]);
            this.setState({
                selectedGroups: currentlySelected
            });
        }
        else {
            let selected = this.state.selectedGroups.slice();
            selected.splice(selectedExist, 1);
            this.setState({
                selectedGroups: selected
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
    handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }
    handleTimeChange(time) {
        this.setState({
            startTime: time
        });
    }
    checkIfActive(id) {
        if (this.state.selectedGroups.map(a => a.id).findIndex(id) > -1) {
            return false;
        }
        else {
            return false;
        }
    }

    isButton1() {
        return (this.state.numberOfRoutes === 1);
    }
    isButton2() {
        return (this.state.numberOfRoutes === 2);
    }

    render() {
        
    
    
        var groups = this.state.groups.map((a, index) => (<GroupItem index={index} existingGroups={this.state.selectedGroups} key={a.id} onClick={() => this.addGroup(index)} value={a.id}display={a.name}></GroupItem>));
        
        return (
            <div>
            <Col md={4}>
                <Form>
                    <FormGroup>
                        <ControlLabel>Event Name</ControlLabel>
                        <FormControl

                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange} />

                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Date</ControlLabel>
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleDateChange}

                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Time</ControlLabel>
                        <DatePicker
                            selected={this.state.startTime}
                            onChange={this.handleTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            dateFormat="LT"
                            timeCaption="Time"
                        />
                        </FormGroup>
                </Form>
                    <Button onClick={() => this.props.goToRoutes(this.state.name,this.state.description,this.state.startDate,this.state.startTime,this.state.groups,this.state.numberOfRoutes)}>Next</Button>
                
            </Col>
            <Col md={4}>
                <ControlLabel>Select Groups To Invite </ControlLabel>
                <ListGroup>{groups} </ListGroup>
                </Col>
                <Col md={4}>
                    <ControlLabel>
                        Choose Number of Routes
                        </ControlLabel>
                    <ButtonToolbar>
                        <Button active={this.isButton1()} onClick={this.chooseButton1}>1</Button>
                        <Button active={this.isButton2()} onClick={this.chooseButton2}>2</Button>
                    </ButtonToolbar>
                    </Col>
                </div>
            );
    }

}