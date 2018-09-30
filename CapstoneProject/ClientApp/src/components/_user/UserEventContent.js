import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateEvent } from './_events/CreateEvent';


export class UserEventContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createEvent: false
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



    render() {
        const backToEventHome = this.backToEventHome;
        if (this.state.createEvent) {
            return (<CreateEvent backToEventHome={backToEventHome} />);
        }
        else {
            return (

                <div>
                    <Button onClick={(event) => this.addNewEvent(event)}>Create New Event</Button>


                </div>


            );
        }
    }



}