import React, { Component } from 'react';
import { Button,Col, Row, ButtonToolbar, Alert } from 'react-bootstrap';
import { Details } from './Details';
import {RouteInfo} from './RouteInfo';
import { StravaData } from './StravaData';
import { RouteChoiceButtons } from '../_mapComponents/RouteChoiceButtons';
import { RouteMap } from '../_mapComponents/RouteMap';
import { RouteComments } from '../_mapComponents/RouteComments';
import { EventNavigation } from '../_events/EventNavigation';

export class ViewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }],
            routeShowing: {routeSpot: 1, values: true},
            isViewingTab: 1
        }
        this.onPathHover = this.onPathHover.bind(this);
        this.onMarkerHover = this.onMarkerHover.bind(this);
        this.dismissPathComment = this.dismissPathComment.bind(this);
        this.dismissPointComment = this.dismissPointComment.bind(this);
        this.viewRoute = this.viewRoute.bind(this);
        this.changeViewingTab = this.changeViewingTab.bind(this);
        this.rsvp = this.rsvp.bind(this);
    }
    dismissPointComment() {
        let currentComments = this.state.comments;
        currentComments[0] = { position: -1, author: null, comment: null };
        this.setState({
            comments: currentComments
        })
    }
    dismissPathComment() {
        let currentComments = this.state.comments;
        currentComments[1] = { position: -1, author: null, comment: null };
        this.setState({
            comments: currentComments
        })
    }

    onPathHover(data) {
        if (this.state.isViewingTab === 2) {
            let latitude1 = data.path[0].lat;
            let longitude1 = data.path[0].lng;
            let latitude2 = data.path[1].lat;
            let longitude2 = data.path[1].lng;
            let route = this.getWhichRoute();
            let pathCommentArray = route.pathCoordinates;
            let pathCommentPosition = pathCommentArray.findIndex(a => a[0].lat === latitude1 && a[0].lng === longitude1 && a[1].lat === latitude2 && a[1].lng === longitude2);
            let pathCommentToShow = route.pathComments[pathCommentPosition];
            let pathCommentAuthor = route.pathCommentAuthors[pathCommentPosition];
            let currentCommentsShowing = this.state.comments;
            currentCommentsShowing[1] = { position: pathCommentPosition, author: pathCommentAuthor, comment: pathCommentToShow }
            this.setState({
                comments: currentCommentsShowing
            });
        }
    }
    onMarkerHover(data) {
        if (this.state.isViewingTab === 2) {
            let latitude = data.position.lat;
            let longitude = data.position.lng;
            let route = this.getWhichRoute();
            let commentArray = route.pointCoordinates;
            let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
            let commentToShow = route.pointComments[commentPosition];
            let commentAuthor = route.pointCommentAuthors[commentPosition];
            let currentCommentsShowing = this.state.comments;
            currentCommentsShowing[0] = { position: commentPosition, author: commentAuthor, comment: commentToShow };
            this.setState({
                comments: currentCommentsShowing
            });
        }
    }

    getWhichRoute() {
        switch (this.state.routeShowing.routeSpot) {
            case (1):
                return this.props.route1;
            case (2):
                return this.props.route2;
        }
    }

    viewRoute(routeNumber) {
        let currentShowing = this.state.routeShowing;
        currentShowing.routeSpot = routeNumber;
        this.setState({
            routeShowing: currentShowing,
            comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }]
        })
    }

    changeViewingTab(number) {
        this.setState({
            isViewingTab: number
        })
    }
    
    rsvp() {
        var userId = localStorage.getItem('userId');
        var ventId = this.props.eventId;
        fetch(`api/Events/Rsvp?user=${userId}&vent=${ventId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(error => console.log(error));
    }

    render() {
        let rsvpButton = null;
        const viewPointComment = ((data) => { this.onMarkerHover(data) });
        const viewPathComment = ((data) => { this.onPathHover(data) });
        let routesViewing = 0;
        if (this.props.route2 !== null) {
            routesViewing = 2;
        }
        else if (this.props.route1 !== null) {
            routesViewing = 1;
        }
        let tab = null;
        switch (this.state.isViewingTab) {
            case (1): tab = <Details description={this.props.description} date={this.props.date}
                time={this.props.time} organizer={this.props.organizer} address={this.props.address} />
                break;
            case (2): tab = <div>
                <RouteInfo route1={this.props.route1} route1Details={this.props.route1Details}
                    route2={this.props.route2} route2Details={this.props.route2Details} routeShowing={this.state.routeShowing}
                    hasSelected={true}
                />
                <RouteChoiceButtons routesViewing={routesViewing} viewRoute={(routeNumber) => this.viewRoute(routeNumber)} routeShowing={this.state.routeShowing} />
            </div>
                break;
            case (3): tab = 
                this.props.goingNames.map((member, index) => <Alert key={index} bsStyle='success' >{member}</Alert>)
                rsvpButton = <Button active={this.props.going} onClick={this.rsvp}>I'm going</Button>
                break;
            case (4): tab = <StravaData id={this.props.eventId} date={this.props.date} />
        }
       
        return (
            <div>
                <h3>{this.props.Name}</h3>
                <Row>
                    <Col md={4}>
                        <EventNavigation currentTab={this.state.isViewingTab} changeTab={(number) => this.changeViewingTab(number)} />
                        {tab}
                    </Col>
                    <Col md={2}>
                        {rsvpButton}
                        <Row><RouteComments comments={this.state.comments} dismissPointComment={() => this.dismissPointComment()}
                            dismissPathComment={() => this.dismissPathComment()} /> </Row>
                    </Col>
                    <Col md={6}>
                        <div className="custom-map">
                            <RouteMap clickAction={null}
                                routeShowing={this.state.routeShowing}
                                startingPointPosition={this.props.addressCoords}
                                routesViewing={routesViewing}
                                route1={this.props.route1}
                                comments={this.state.comments}
                                viewPointComment={viewPointComment}
                                route2={this.props.route2}
                                viewPathComment={viewPathComment}
                            />
                        </div>

                    </Col>
                </Row>
            </div>

        );
    }
} 


