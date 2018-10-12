import React, { Component } from 'react';
import { Button,Col, Row, ListGroup, ListGroupItem, Tooltip, Glyphicon, OverlayTrigger, ButtonGroup } from 'react-bootstrap';
import { Details } from './Details';
import {RouteInfo} from './RouteInfo';
import { StravaData } from './StravaData';
import { RouteChoiceButtons } from '../_mapComponents/RouteChoiceButtons';
import { RouteMap } from '../_mapComponents/RouteMap';
import { RouteComments } from '../_mapComponents/RouteComments';
import { EventNavigation } from '../_events/EventNavigation';
import stravalogo from './icons/stravalogo.png';

export class ViewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }],
            routeShowing: {routeSpot: 1, values: true},
            isViewingTab: 1,
            viewComments: false,
            resultsView: 1,
            routeResultsView: 1
        }
        this.onPathHover = this.onPathHover.bind(this);
        this.onMarkerHover = this.onMarkerHover.bind(this);
        this.dismissPathComment = this.dismissPathComment.bind(this);
        this.dismissPointComment = this.dismissPointComment.bind(this);
        this.viewRoute = this.viewRoute.bind(this);
        this.changeViewingTab = this.changeViewingTab.bind(this);
        this.rsvp = this.rsvp.bind(this);
        this.hideUnhideComments = this.hideUnhideComments.bind(this);
        this.changeResultsView = this.changeResultsView.bind(this);
        this.changeRouteView = this.changeRouteView.bind(this);
    }

    changeResultsView(number) {
        this.setState({
            resultsView: number
        })
    }

    changeRouteView(number) {
        this.setState({
            routeResultsView: number
        });
    }

    hideUnhideComments() {
        let current = this.state.viewComments;
        let comments = (current) ? [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }] : this.state.comments;
        this.setState({
            viewComments: !current,
            comments: comments
        })
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
            isViewingTab: number,
            viewComments: false
        })
    }
    
    async rsvp() {
        var userId = localStorage.getItem('userId');
        var ventId = this.props.eventId;
        await fetch(`api/Events/Rsvp?user=${userId}&vent=${ventId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(error => console.log(error));
    }

    render() {
        const infoBox = {
            paddingTop: "12px",
            paddingBottom: "10px",
            backgroundColor: "#c2e6ff",
            marginTop: "10px",
            paddingLeft: "15px",
            paddingRight: "5px",
            marginRight: "55px",
            color: "#555",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px"

        }
        const listStyle = {
            marginTop: "10px",

        }
        const listItemStyle = {
            backgroundColor: "#c2e6ff",
            color: "#555"
        }
        const resultBtn = {
            marginTop: "120px",
            marginLeft: "20px"
        }
        const resultBtn2 = {
            padding: "1.5px 3px"
        }
        let commentIcon;
        if ((this.state.routeShowing.values === true) &&
            ((this.state.routeShowing.routeSpot === 1 && (this.props.route1.pointComments.length > 0 || this.props.route1.pathComments.length > 0))
                || (this.state.routeShowing.routeSpot === 2 && (this.props.route2.pointComments.length > 0 || this.props.route2.pathComments.length > 0)))) {
            let message;
            if (!this.state.viewComments) {
                message = <Tooltip id="tooltip">
                    This route has comments! Click to view.
            </Tooltip>
                commentIcon = <a onClick={this.hideUnhideComments}> <OverlayTrigger placement="top" overlay={message}>
                    <Glyphicon className="comment-icon" glyph="comment" />
                </OverlayTrigger> </a>
            }
            else {
                message = <Tooltip id="tooltip">
                    Hover on the map to view comments. Click to stop viewing comments.
            </Tooltip>
                commentIcon = <a onClick={this.hideUnhideComments}> <OverlayTrigger placement="top" overlay={message}>
                    <Glyphicon className="comment-icon-active" glyph="comment" />
                </OverlayTrigger> </a>
            }

        }
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
        let logo = null;
        let resultButtons = null;
        let routeButtons = null;
        switch (this.state.isViewingTab) {
            case (1): tab = <Details description={this.props.description} date={this.props.date}
                time={this.props.time} organizer={this.props.organizer} address={this.props.address} />
                break;
            case (2): tab = <div>
                <RouteInfo style={infoBox} route1={this.props.route1} route1Details={this.props.route1Details}
                    route2={this.props.route2} route2Details={this.props.route2Details} routeShowing={this.state.routeShowing}
                    hasSelected={true} hasFinished={true}
                />
                <Row>
                    <Col md={6}>
                        <RouteChoiceButtons routesViewing={routesViewing} viewRoute={(routeNumber) => this.viewRoute(routeNumber)} routeShowing={this.state.routeShowing} />
                    </Col>
                    <Col md={1}>
                        {commentIcon}
                        </Col>
            </Row>
                    </div>
                break;
            case (3): tab =
                <ListGroup style={listStyle}>
                {this.props.goingNames.map((member, index) => <ListGroupItem style={listItemStyle} key={index} >{member}</ListGroupItem>)}
                </ListGroup>
                rsvpButton = <Button className="normal-buttons btn" active={this.props.going} onClick={this.rsvp}>I'm going</Button>
                break;
            case (4): tab = <StravaData id={this.props.eventId} date={this.props.date} time={this.props.time} route1={this.props.route1} route2={this.props.route2} view={this.state.resultsView} routeResultsView={this.state.routeResultsView} />
                logo = <img src={stravalogo} />
                resultButtons = <ButtonGroup style={resultBtn} vertical className="map-action-buttons">
                    <Button style={resultBtn2} onClick={() => this.changeResultsView(1)} active={this.state.resultsView === 1}>Overall</Button>
                    <Button style={resultBtn2} onClick={() => this.changeResultsView(2)} active={this.state.resultsView === 2}>Results</Button>
                </ButtonGroup>
                if (this.props.route2 !== null) {
                    routeButtons = <ButtonGroup style={resultBtn} vertical className="map-action-buttons">
                        <Button style={resultBtn2} onClick={() => this.changeRouteView(1)} active={this.state.routeResultsView === 1}>Route A</Button>
                        <Button style={resultBtn2} onClick={() => this.changeRouteView(2)} active={this.state.routeResultsView === 2}>Route B</Button>
                    </ButtonGroup>
                }
        }
        const style = {
            backgroundColor: "purple",
            height: "85vh",
        };
   
       
        return (
            
            <div style={style}>
                <Row className="empty-space5percent" />
               
                <Row>
                    <Col md={1}>
                        {resultButtons}
                        </Col>
                    <Col md={4}>
                        <h3 className="page-subtitle">{this.props.name}</h3>
                        <EventNavigation currentTab={this.state.isViewingTab} changeTab={(number) => this.changeViewingTab(number)} />
                        {tab}
                    </Col>
                    <Col md={1}>
                        {rsvpButton}
                        {routeButtons}
                        <Row><RouteComments comments={this.state.comments} dismissPointComment={() => this.dismissPointComment()}
                            dismissPathComment={() => this.dismissPathComment()} viewEvent={true}/> </Row>
                    </Col>
                    <Col md={5}>
                        <div className="custom-map2">
                            <RouteMap clickAction={null}
                                routeShowing={this.state.routeShowing}
                                startingPointPosition={this.props.addressCoords}
                                routesViewing={routesViewing}
                                route1={this.props.route1}
                                comments={this.state.comments}
                                viewPointComment={viewPointComment}
                                route2={this.props.route2}
                                viewPathComment={viewPathComment}
                                viewComments={this.state.viewComments}
                            />
                        </div>
                    </Col>

                </Row>
                <Row>
                    <Col md={2} mdOffset={1}>
                        {logo}
                    </Col>
                    <Col md={2} mdOffset={6}>
                        <a className="btn action-button under-map" onClick={this.props.backToEventHome}>Back</a>

                        </Col>
                </Row>
            </div>

        );
    }
} 


