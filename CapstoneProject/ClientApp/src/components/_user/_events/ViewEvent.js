import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';
import { SearchRoutes } from '../_routes/SearchRoutes';
import { RouteList } from '../_routes/RouteList';
import { DistanceButtons } from '../_routes/DistanceButtons';
import { HillButtons } from '../_routes/HillButtons';
import _ from 'lodash';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png';
import { Details } from './Details';
import { RouteInfo } from './RouteInfo';
import { StravaData } from './StravaData';


export class ViewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentPosition1: null,
            commentShowing1: null,
            commentPosition2: null,
            commentShowing2: null,
            pathCommentShowing1: null,
            pathCommentPosition1: null,
            pathCommentShowing2: null,
            pathCommentShowing2: null,
            routeShowing: 1,
            isViewingDetails: true

        }

        
       
        this.onPathHover1 = this.onPathHover1.bind(this);
        this.onPathHover2 = this.onPathHover2.bind(this);
        this.onMarkerHover1 = this.onMarkerHover1.bind(this);
        this.onMarkerHover2 = this.onMarkerHover2.bind(this);
        this.dismissComment1 = this.dismissComment1.bind(this);
        this.dismissComment2 = this.dismissComment2.bind(this);
        this.dismissPathComment1 = this.dismissPathComment1.bind(this);
        this.dismissPathComment2 = this.dismissPathComment2.bind(this);
        
        this.viewRouteA = this.viewRouteA.bind(this);
        this.viewRouteB = this.viewRouteB.bind(this);
        this.isViewingDetails = this.isViewingDetails.bind(this);
        this.isViewingRouteInfo = this.isViewingRouteInfo.bind(this);
        this.isViewingMembers = this.isViewingMembers.bind(this);
        this.isViewingStrava = this.isViewingStrava.bind(this);
        this.rsvp = this.rsvp.bind(this);
        
    }
 


    dismissComment1() {
        this.setState({
            commentShowing1: null,
            commentPosition1: null
        })
    }
    dismissPathComment1() {
        this.setState({
            pathCommentShowing1: null,
            pathCommentPosition1: null
        })
    }
    dismissComment2() {
        this.setState({
            commentShowing2: null,
            commentPosition2: null
        })
    }
    dismissPathComment2() {
        this.setState({
            pathCommentShowing2: null,
            pathCommentPosition2: null
        })
    }

    onPathHover1(data) {
        let latitude1 = data.path[0].lat;
        let longitude1 = data.path[0].lng;
        let latitude2 = data.path[1].lat;
        let longitude2 = data.path[1].lng;
        let pathCommentArray = this.props.route1.pathCoordinates;
        let pathCommentPosition = pathCommentArray.findIndex(a => a[0].lat === latitude1 && a[0].lng === longitude1 && a[1].lat === latitude2 && a[1].lng === longitude2);
        let pathCommentToShow = this.props.route1.pathComments[pathCommentPosition];
        this.setState({
            pathCommentShowing1: pathCommentToShow,
            pathCommentPosition1: pathCommentPosition
        });
    }
    onPathHover2(data) {
        let latitude1 = data.path[0].lat;
        let longitude1 = data.path[0].lng;
        let latitude2 = data.path[1].lat;
        let longitude2 = data.path[1].lng;
        let pathCommentArray = this.props.route2.pathCoordinates;
        let pathCommentPosition = pathCommentArray.findIndex(a => a[0].lat === latitude1 && a[0].lng === longitude1 && a[1].lat === latitude2 && a[1].lng === longitude2);
        let pathCommentToShow = this.props.route2.pathComments[pathCommentPosition];
        this.setState({
            pathCommentShowing2: pathCommentToShow,
            pathCommentPosition2: pathCommentPosition
        });
    }
    onMarkerHover1(data) {

        let latitude = data.position.lat;
        let longitude = data.position.lng;
        let commentArray = this.props.route1.pointCoordinates;
        let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
        let commentToShow = this.props.route1.pointComments[commentPosition];
        this.setState({
            commentShowing1: commentToShow,
            commentPosition1: commentPosition
        });
    }
    onMarkerHover2(data) {

        let latitude = data.position.lat;
        let longitude = data.position.lng;
        let commentArray = this.props.route2.pointCoordinates;
        let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
        let commentToShow = this.props.route2.pointComments[commentPosition];
        this.setState({
            commentShowing2: commentToShow,
            commentPosition2: commentPosition
        });
    }



    

    isRouteA() {
        return this.state.routeShowing === 1;
    }

    viewRouteA() {
        this.setState({
            routeShowing: 1
        })
    }
    viewRouteB() {
        this.setState({
            routeShowing: 2
        })
    }

    isViewingDetails() {
        this.setState({
            isViewingDetails: true,
            isViewingRouteInfo: false,
            isViewingMembers: false,
            isViewingStrava: false
        })
    }
    isViewingRouteInfo() {
        this.setState({
            isViewingDetails: false,
            isViewingRouteInfo: true,
            isViewingMembers: false,
            isViewingStrava: false
        })
    }
    isViewingMembers() {
        this.setState({
            isViewingDetails: false,
            isViewingRouteInfo: false,
            isViewingMembers: true,
            isViewingStrava: false
        })
    }
    isViewingStrava() {
        this.setState({
            isViewingDetails: false,
            isViewingRouteInfo: false,
            isViewingMembers: false,
            isViewingStrava: true
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
        
            var route1Markers = (this.props.route1.pointCoordinates.map((coord, index) => {
                if (this.state.commentPosition1 === index) {
                    return (
                        <Marker key={index}
                            icon={img2}
                            onMouseover={(data) => this.onMarkerHover1(data)}
                            google={window.google}
                            position={coord}
                        />
                    );
                }
                else {
                    return (
                        <Marker key={index}
                            icon={img1}
                            onMouseover={(data) => this.onMarkerHover1(data)}
                            google={window.google}
                            position={coord}
                        />

                    );
                }
            }));

            var route2Markers = (this.props.route2.pointCoordinates.map((coord, index) => {
                if (this.state.commentPosition2 === index) {
                    return (
                        <Marker key={index}
                            icon={img2}
                            onMouseover={(data) => this.onMarkerHover2(data)}
                            google={window.google}
                            position={coord}
                        />
                    );
                }
                else {
                    return (
                        <Marker key={index}
                            icon={img1}
                            onMouseover={(data) => this.onMarkerHover2(data)}
                            google={window.google}
                            position={coord}
                        />

                    );
                }
            }));


            var segments1 = (this.props.route1.pathCoordinates.map((path, index) => {

                return (
                    <Polyline strokeWeight={6}
                        key={index}
                        path={path}
                        strokeColor="#80ff00"
                        onMouseover={(data) => this.onPathHover1(data)}
                    />
                );

            }

            ));
        
        var segments2 = null;
        if (this.state.routesViewing > 1) {
            segments2 = (this.props.route2.pathCoordinates.map((path, index) => {

                return (
                    <Polyline strokeWeight={6}
                        key={index}
                        path={path}
                        strokeColor="#80ff00"
                        onMouseover={(data) => this.onPathHover2(data)}
                    />
                );

            }

            ));
        }
        var alert = null;
        var alert2 = null;
        var alert3 = null;
        var alert4 = null;
        if (this.state.commentShowing1 != null && this.state.isViewingRouteInfo) {
            alert = <Alert bsStyle="info" onDismiss={this.dismissComment1}>
                <h4>{this.props.route1.pointCommentAuthors[this.state.commentPosition1]}</h4>
                <p> {this.state.commentShowing1} </p> </Alert>
        }
        if (this.state.pathCommentShowing1 != null && this.state.isViewingRouteInfo) {
            alert2 = <Alert bsStyle="success" onDismiss={this.dismissPathComment1}>
                <h4>{this.props.route1.pathCommentAuthors[this.state.pathCommentPosition1]}</h4>

                <p> {this.state.pathCommentShowing1} </p> </Alert>
        }
        if (this.state.commentShowing2 != null && this.state.isViewingRouteInfo ) {
            alert3 = <Alert bsStyle="info" onDismiss={this.dismissComment2}>
                <h4>{this.props.route2.pointCommentAuthors[this.state.commentPosition2]}</h4>
                <p> {this.state.commentShowing2} </p> </Alert>
        }
        if (this.state.pathCommentShowing2 != null && this.state.isViewingRouteInfo) {
            alert4 = <Alert bsStyle="success" onDismiss={this.dismissPathComment2}>
                <h4>{this.props.route2.pathCommentAuthors[this.state.pathCommentPosition2]}</h4>

                <p> {this.state.pathCommentShowing2} </p> </Alert>
        }
        
        var finalRoutes = null;
        if (this.state.routesViewing === 2) {
            finalRoutes = <ButtonToolbar>
                <Button onClick={() => this.viewRouteA()} active={this.isRouteA()}>Route A</Button>
                <Button onClick={() => this.viewRouteB()} active={!this.isRouteA()}>Route B</Button>
            </ButtonToolbar>
        }
        var routeShowing = <div>
            <h4> Route A: {this.props.route1.name}</h4>
            <FormGroup>
                <ControlLabel>Distance:</ControlLabel>  {Number(this.props.route1.totalDistance).toFixed(2)} miles
            </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(this.props.route1.totalElevationGain).toFixed(2)} meters
            </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(this.props.route1.totalElevationLoss).toFixed(2)} meters
            </FormGroup>
            <FormGroup>
                <ControlLabel>Event Details for this Route</ControlLabel>
                <FormControl type='textarea' value={this.props.route1details} name="route1details" onChange={this.handleChange} />
            </FormGroup>
        </div>
        if (this.state.routeShowing === 2) {
            routeShowing = <div>
                <h4> Route B: {this.props.route2.name}</h4>
                <FormGroup>
                    <ControlLabel>Distance:</ControlLabel>  {Number(this.props.route2.totalDistance).toFixed(2)} miles
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(this.props.route2.totalElevationGain).toFixed(2)} meters
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(this.props.route2.totalElevationLoss).toFixed(2)} meters
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Event Details for this Route</ControlLabel>
                    <FormControl type='textarea' value={this.props.route2details} name="route2details" onChange={this.handleChange} />
                </FormGroup>
            </div>
        }
       
        if (this.state.addressCoords != null) {
            var startingPoint = (
                <Marker


                    google={window.google}
                    position={this.props.startingPoint}
                />
            );
        }
        var details = null;
        if (this.state.isViewingDetails) {
            details = <Details description={this.props.description} date={this.props.date}
                time={this.props.time} organizer={this.props.organizer} address={this.props.address}/>
        }
        var routeInfo = null;
        if (this.state.isViewingRouteInfo) {
            routeInfo = <RouteInfo route1={this.props.route1} route1Details={this.props.route1Details}
                route2={this.props.route2} route2Details={this.props.route2Details} />
        }
        var rsvp = null;
        var rsvpButton = null;
        if (this.state.isViewingMembers) {
            rsvp = this.props.goingNames.map((member, index) => <Alert key={index} bsStyle='success' >{member}</Alert>)
            rsvpButton = <Button active={this.props.going} onClick={this.rsvp}>I'm going</Button>
        }
        var strava = null;
        if (this.state.isViewingStrava) {
            strava = <StravaData id={this.props.eventId} date={this.props.date}/>
        }
        return (


            <div>
                <h3>{this.props.Name}</h3>
                <Row>
                    <Col md={4}>
                        <ButtonToolbar>
                            <Button active={this.state.isViewingDetails}onClick={() => this.isViewingDetails()}>Details</Button>
                            <Button active={this.state.isViewingRouteInfo} onClick={() => this.isViewingRouteInfo()}>Route Info</Button>
                            <Button active={this.state.isViewingMembers} onClick={() => this.isViewingMembers()}>RSVP</Button>
                            <Button active={this.state.isViewingStrava} onClick={() => this.isViewingStrava()}>Results</Button>
                            </ButtonToolbar>
                        {details}
                        {routeInfo}
                        {rsvp}
                        {strava}
                    </Col>
                    <Col md={2}>
                        {rsvpButton}
                        <Row>{alert} {alert2} {alert3} {alert4} </Row>
                       

                    </Col>
                    <Col md={6}>
                        <div className="custom-map">
                            <Map google={window.google}
                                initialCenter={{ lat: 43.0435794, lng: -88.0138458 }}
                                zoom={12}
                            >{startingPoint}
                                {route1Markers}
                                {route2Markers}
                                <Polyline
                                    strokeWeight={6}
                                    path={this.props.route1.coordinates} />
                                <Polyline
                                    strokeWeight={6}
                                    strokeColor='#F39C12'
                                    path={this.props.route2.coordinates} />
                                {segments1}
                                {segments2}

                            </Map>
                        </div>

                    </Col>
                </Row>

                <Row>

                </Row>
            </div>

        );
    }
} export default GoogleApiWrapper({
})(ViewEvent)


