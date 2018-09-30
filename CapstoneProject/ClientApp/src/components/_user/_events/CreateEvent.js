import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { SelectGroups } from './SelectGroups';
import { SelectRoutes } from './SelectRoutes';
export class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasGroups: false,
            hasRoutes: false,
        }
        this.goToRoutes = this.goToRoutes.bind(this);
    }
    async goToRoutes(name, description, date, time, groups, numberOfRoutes) {
        let userId = localStorage.getItem('userId');
        let eventId;
        let data = {
            userId: userId,
            name: name,
            description: description,
            date: date,
            time: time,
            groups: groups
        }
        await fetch('api/Events/CreateNewEvent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => { return (eventId = data.id); }).catch(error => console.log(error));

        this.setState({
            hasGroups: true,
            hasRoutes: false,
            name: name,
            description: description,
            date: date,
            time: time,
            groups: groups,
            numberOfRoutes: numberOfRoutes,
            eventId: eventId
        })
    }


    render() {
        var action;
        const goToRoutes = (name, description, date, time, groups, numberOfRoutes) => this.goToRoutes(name, description, date, time, groups, numberOfRoutes);
        if (!this.state.hasGroups) {
            action = <SelectGroups goToRoutes={goToRoutes} />
        }
        else if (!this.state.hasRoutes) {
            action = <SelectRoutes name={this.state.name} id={this.state.eventId} numberOfRoutes={this.state.numberOfRoutes}/>
        }
        return (
            <div>
                <h2>Create Event</h2>
                <Row>
                    {action}
                </Row>
                <Row>
                    <Col md={3}>
                        <Button onClick={this.props.backToEventHome}>Back</Button>
                       


                    </Col>
                </Row>
            </div>
            );
    }



}