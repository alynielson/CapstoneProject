import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col,Table, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateEvent } from './_events/CreateEvent';
import moment from 'moment';
import { ViewEvent } from './_events/ViewEvent';


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
    async goToEventPage(id, date, name, time, organizer, going) {
        let eventId = id;

        await fetch(`api/Events/GetAllEventInfo?id=${id}`).then(response => response.json()).then(data => {
            data.route1.coordinates = data.route1.coordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
            data.route1.pointCoordinates = data.route1.pointCoordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
            data.route1.pathCoordinates = data.route1.pathCoordinates.map(a => {
                return [
                    { lat: parseFloat(a[0].lat), lng: parseFloat(a[0].lng) },
                    { lat: parseFloat(a[1].lat), lng: parseFloat(a[1].lng) }
                ]
            });
            data.route2.coordinates = data.route2.coordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
            data.route2.pointCoordinates = data.route2.pointCoordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
            data.route2.pathCoordinates = data.route2.pathCoordinates.map(a => {
                return [
                    { lat: parseFloat(a[0].lat), lng: parseFloat(a[0].lng) },
                    { lat: parseFloat(a[1].lat), lng: parseFloat(a[1].lng) }
                ]
            });
            let ventId = eventId;
            this.setState({
                eventId: ventId,
                name: name,
                date: date,
                time: time,
                organizer: organizer,
                going: going,
                description: data.description,
                address: data.address,
                startPoint: data.startPoint,
                route1: data.route1,
                route2: data.route2,
                route1Details: data.route1Details,
                route2Details: data.route2Details,
                goingNames: data.goingNames,
                viewingEvent: true
            })
        });
        console.log("awaited");
    }



    render() {
        var eventsInTable = null;
        if (this.state.eventsInTable != null) {
            eventsInTable = this.state.eventsInTable.map(data => {
                return (
                    <tr onClick={() => this.goToEventPage(data.eventId, data.date, data.name, data.time, data.organizer, data.going)}>
                        <td>{moment(data.date).format('dddd, MMMM Do YYYY')}</td>
                        <td>{data.name}</td>
                        <td>{moment(data.time).format('HH:mm a')}</td>
                        <td>{data.organizer}</td>
                        <td>{data.going}</td>
                    </tr>
                    
                    )

            }

            );
        }
        const backToEventHome = this.backToEventHome;
        if (this.state.createEvent) {
            return (<CreateEvent backToEventHome={backToEventHome} />);
        }
        if (this.state.viewingEvent) {
            return <ViewEvent
                eventId={this.state.eventId}
                description={this.state.description}
                name={this.state.name}
                date={this.state.date}
                time={this.state.time}
                organizer={this.state.organizer}
                going={this.state.going}
                address={this.state.address}
                startPoint={this.state.startPoint}
                route1={this.state.route1}
                route2={this.state.route2}
                route1Details={this.state.route1Details}
                route2Details={this.state.route2Details}
                goingNames={this.state.goingNames}
                backToEventHome={backToEventHome} />

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