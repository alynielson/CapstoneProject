import React, { Component } from 'react';
import { Button, Col, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class EventNavigation extends Component {
    render() {
        return (
            <ButtonToolbar>
                <Button active={this.props.currentTab === 1} onClick={() => this.props.changeTab(1)}>Details</Button>
                <Button active={this.props.currentTab === 2} onClick={() => this.props.changeTab(2)}>Route Info</Button>
                <Button active={this.props.currentTab === 3} onClick={() => this.props.changeTab(3)}>RSVP</Button>
                <Button active={this.props.currentTab === 4} onClick={() => this.props.changeTab(4)}>Results</Button>
            </ButtonToolbar>
            );
    }
}