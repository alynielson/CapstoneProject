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
            eventId: eventId,
            
        })
    }

    finishCreating(address, currentRoute1Id, currentRoute2Id, route1details, route2details, addressCoords) {
        var eventId = this.state.eventId;
        var data = {
            address: address,
            routeId1: currentRoute1Id,
            routeId2: currentRoute2Id,
            routeDetails1: route1details,
            routeDetails2: route2details,
            addressCoords: addressCoords,
            eventId: eventId
        }
        fetch('/api/Events/AddDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));
        this.props.backToEventHome();

        
    }

       




    render() {

        var action;
        const onCompleting = ((address, currentRoute1Id, currentRoute2Id, route1details, route2details, addressCoords) => this.finishCreating(address, currentRoute1Id, currentRoute2Id, route1details, route2details, addressCoords));
        const goToRoutes = (name, description, date, time, groups, numberOfRoutes) => this.goToRoutes(name, description, date, time, groups, numberOfRoutes);
        if (!this.state.hasGroups) {
            action = <SelectGroups goToRoutes={goToRoutes} />

        }
        else if (!this.state.hasRoutes) {
            action = <SelectRoutes name={this.state.name} id={this.state.eventId} onCompleting={onCompleting} numberOfRoutes={this.state.numberOfRoutes} />
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