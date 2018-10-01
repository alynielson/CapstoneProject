import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col,Table, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateEvent } from './_events/CreateEvent';
import moment from 'moment';



export class UserEventContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createEvent: false,
            eventsInTable: null
        }
        this.addNewEvent = this.addNewEvent.bind(this);
        this.backToEventHome = this.backToEventHome.bind(this);
    }
    addNewEvent(event) {
        event.preventDefault();
        this.setState({
            createEvent: true
        })
    }
    backToEventHome() {
        this.setState({
            createEvent: false
        })
    }
    componentDidMount() {
        var userId = localStorage.getItem('userId');
        fetch(`api/Events/GetUserEvents?userId=${userId}`).then(response => response.json()).then(data =>
            this.setState({
                eventsInTable: data
            })
        ).catch(error => console.log(error));
        console.log("I at least hit the function");
    }



    render() {
        var eventsInTable = null;
        if (this.state.eventsInTable != null) {
            eventsInTable = this.state.eventsInTable.map(data => {
                return (
                    <tr>
                        <td>{moment(data.date).format('dddd, MMMM Do YYYY')}</td>
                        <td>{data.name}</td>
                        <td>{moment(data.time).format('HH:mm a')}</td>
                        <td>{data.organizer}</td>
                        <td>{data.going}</td>
                    </tr>
                    
                    );

            }

            );
        }
        const backToEventHome = this.backToEventHome;
        if (this.state.createEvent) {
            return (<CreateEvent backToEventHome={backToEventHome} />);
        }
        else {
            return (
                <div>
                <Row>
                    <Button onClick={(event) => this.addNewEvent(event)}>Create New Event</Button>
                </Row>
                <h3>Upcoming Events</h3>
                <Table hover>
                    <thead>
                        <tr>
                            
                            <th>Date</th>
                            <th>Event</th>
                            <th>Time</th>
                            <th>Organizer</th>
                            <th>Going</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventsInTable}
                    </tbody>
                    </Table>
                    </div>
            );
        }
    }



}