import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar,Alert} from 'react-bootstrap';
import { SearchRoutes } from '../_routes/SearchRoutes';
import { RouteList } from '../_routes/RouteList';
import { DistanceButtons } from '../_routes/DistanceButtons';
import { HillButtons } from '../_routes/HillButtons';
import _ from 'lodash';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png';


export class SelectRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routeToAdd: [],
            distanceFilter: '',
            hillFilter: '',
            routesViewing: 0,
            route1: {},
            route2: {},
            commentPosition1: null,
            commentShowing1: null,
            commentPosition2: null,
            commentShowing2: null,
            pathCommentShowing1: null,
            pathCommentPosition1: null,
            pathCommentShowing2: null,
            pathCommentShowing2: null
            
        }
       
        this.setDistanceFilter = this.setDistanceFilter.bind(this);
        this.setHillFilter = this.setHillFilter.bind(this);
        this.getRouteToEdit = this.getRouteToEdit.bind(this);
        this.onPathHover1 = this.onPathHover1.bind(this);
        this.onPathHover2 = this.onPathHover2.bind(this);
        this.onMarkerHover1 = this.onMarkerHover1.bind(this);
        this.onMarkerHover2 = this.onMarkerHover2.bind(this);
        this.dismissComment1 = this.dismissComment1.bind(this);
        this.dismissComment2 = this.dismissComment2.bind(this);
        this.dismissPathComment1 = this.dismissPathComment1.bind(this);
        this.dismissPathComment2 = this.dismissPathComment2.bind(this);
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
    setDistanceFilter(value) {
        this.setState({

            distanceFilter: value
        });
    }
    onPathHover1(data) {
        let latitude1 = data.path[0].lat;
        let longitude1 = data.path[0].lng;
        let latitude2 = data.path[1].lat;
        let longitude2 = data.path[1].lng;
        let pathCommentArray = this.state.route1.pathCoordinates;
        let pathCommentPosition = pathCommentArray.findIndex(a => a[0].lat === latitude1 && a[0].lng === longitude1 && a[1].lat === latitude2 && a[1].lng === longitude2);
        let pathCommentToShow = this.state.route1.pathComments[pathCommentPosition];
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
        let pathCommentArray = this.state.route2.pathCoordinates;
        let pathCommentPosition = pathCommentArray.findIndex(a => a[0].lat === latitude1 && a[0].lng === longitude1 && a[1].lat === latitude2 && a[1].lng === longitude2);
        let pathCommentToShow = this.state.route2.pathComments[pathCommentPosition];
        this.setState({
            pathCommentShowing2: pathCommentToShow,
            pathCommentPosition2: pathCommentPosition
        });
    }
    onMarkerHover1(data) {

        let latitude = data.position.lat;
        let longitude = data.position.lng;
        let commentArray = this.state.route1.pointCoordinates;
        let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
        let commentToShow = this.state.route1.pointComments[commentPosition];
        this.setState({
            commentShowing1: commentToShow,
            commentPosition1: commentPosition
        });
    }
    onMarkerHover2(data) {

        let latitude = data.position.lat;
        let longitude = data.position.lng;
        let commentArray = this.state.route2.pointCoordinates;
        let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
        let commentToShow = this.state.route2.pointComments[commentPosition];
        this.setState({
            commentShowing2: commentToShow,
            commentPosition2: commentPosition
        });
    }

    setHillFilter(value) {
        this.setState({
            hillFilter: value
        });
    }

   

    searchTest(term2) {
        let terms = term2.toString().trim().toLowerCase().replace(/[^A-Za-z0-9\s]/g, "");
        let distance = `&distanceFilter=${this.state.distanceFilter}`;
        let hills = `&hills=${this.state.hillFilter}`;
        let url = `/api/Routes/RouteSearch?term1=${terms}${distance}${hills}`;
        fetch(url).then(response => response.json())
            .then(jsonData => {
                let routeToSelect = jsonData.map(route => { return { value: route.id, display: `${route.name} - ${route.description}` } });
                this.setState({ routeToAdd: routeToSelect });
            })
            .catch(error => console.log(error));
    }

    getRouteToEdit(selectedRoute) {
        let id = selectedRoute.value;
        let name;
        let city;
        let state;
        let description;
        let owner;
        let totalDistance;
        let totalElevationGain;
        let totalElevationLoss;
        let coordinates;
        let pointCommentAuthors;
        let pointCoordinates;
        let pointComments;
        let pathCommentAuthors;
        let pathCoordinates;
        let pathComments;
        fetch(`api/Routes/GetRoute?id=${id}`).then(response => response.json()).then(data => {
            name = data.name;
            city = data.city;
            state = data.state;
            description = data.description;
            owner = data.ownerName;
            totalDistance = data.totalDistance;
            totalElevationGain = data.totalElevationGain;
            totalElevationLoss = data.totalElevationLoss;
            coordinates = data.coordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
            pointCommentAuthors = data.pointCommentAuthors;
            pointComments = data.pointComments;
            pathCommentAuthors = data.pathCommentAuthors;
            pathComments = data.pathComments;
            pointCoordinates = data.pointCoordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } });
            pathCoordinates = data.pathCoordinates.map(a => {
                return [
                    { lat: parseFloat(a[0].lat), lng: parseFloat(a[0].lng) },
                    { lat: parseFloat(a[1].lat), lng: parseFloat(a[1].lng) }
                ]
            });
            if (this.state.routesViewing === 0 || this.props.numberOfRoutes === 1) {
                this.setState({
                    route1: {
                        name: name,
                        city: city,
                        state: state,
                        description: description,
                        owner: owner,
                        totalDistance: totalDistance,
                        totalElevationGain: totalElevationGain,
                        totalElevationLoss: totalElevationLoss,
                        coordinates: coordinates,
                        defaultLat: Number(coordinates[0].lat),
                        defaultLng: Number(coordinates[1].lng),
                        currentRouteId: id,
                        pointComments: pointComments,
                        pathComments: pathComments,
                        pointCommentAuthors: pointCommentAuthors,
                        pathCommentAuthors: pathCommentAuthors,
                        pointCoordinates: pointCoordinates,
                        pathCoordinates: pathCoordinates
                    },
                    routesViewing: 1
                });
            }
            else if (this.props.numberOfRoutes === 2) {
                var oldRoute = this.state.route1;
                this.setState({
                    route1: {
                        name: name,
                        city: city,
                        state: state,
                        description: description,
                        owner: owner,
                        totalDistance: totalDistance,
                        totalElevationGain: totalElevationGain,
                        totalElevationLoss: totalElevationLoss,
                        coordinates: coordinates,
                        defaultLat: Number(coordinates[0].lat),
                        defaultLng: Number(coordinates[1].lng),
                        currentRouteId: id,
                        pointComments: pointComments,
                        pathComments: pathComments,
                        pointCommentAuthors: pointCommentAuthors,
                        pathCommentAuthors: pathCommentAuthors,
                        pointCoordinates: pointCoordinates,
                        pathCoordinates: pathCoordinates
                    },
                    route2: oldRoute,
                    routesViewing: 2
                });
            }
          
        }
        ).catch(error => console.log(error));

    }

    render() {
        const routeSearch = _.debounce((term2) => { this.searchTest(term2) }, 1000);
        const selectDistanceFilter = ((value) => { this.setDistanceFilter(value) });
        const selectHillFilter = ((value) => { this.setHillFilter(value) });
        const selectRoute = ((selectedRoute) => { this.getRouteToEdit(selectedRoute) });
        var route1Markers = null;
        if (this.state.routesViewing > 0) {
           
            route1Markers = (this.state.route1.pointCoordinates.map((coord, index) => {
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
            

        }
        var route2Markers = null;
        if (this.state.routesViewing > 1) {

            route2Markers = (this.state.route2.pointCoordinates.map((coord, index) => {
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


        }
        var segments1 = null;
        if (this.state.routesViewing > 0) {
            segments1 = (this.state.route1.pathCoordinates.map((path, index) => {

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
        }
        var segments2 = null;
        if (this.state.routesViewing > 1) {
            segments2 = (this.state.route2.pathCoordinates.map((path, index) => {

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
        if (this.state.commentShowing1 != null) {
            alert = <Alert bsStyle="info" onDismiss={this.dismissComment1}>
                <h4>{this.state.route1.pointCommentAuthors[this.state.commentPosition1]}</h4>
                <p> {this.state.commentShowing1} </p> </Alert>
        }
        if (this.state.pathCommentShowing1 != null) {
            alert2 = <Alert bsStyle="success" onDismiss={this.dismissPathComment1}>
                <h4>{this.state.route1.pathCommentAuthors[this.state.pathCommentPosition1]}</h4>

                <p> {this.state.pathCommentShowing1} </p> </Alert>
        }
        if (this.state.commentShowing2 != null) {
            alert3 = <Alert bsStyle="info" onDismiss={this.dismissComment2}>
                <h4>{this.state.route2.pointCommentAuthors[this.state.commentPosition2]}</h4>
                <p> {this.state.commentShowing2} </p> </Alert>
        }
        if (this.state.pathCommentShowing2 != null) {
            alert4 = <Alert bsStyle="success" onDismiss={this.dismissPathComment2}>
                <h4>{this.state.route2.pathCommentAuthors[this.state.pathCommentPosition2]}</h4>

                <p> {this.state.pathCommentShowing2} </p> </Alert>
        }
       
        return (
                

                <div>
                    
                    <Row>
                        <Col md={3}>

                            <SearchRoutes onSearchEnter={routeSearch} />
                            <DistanceButtons sendDistanceArray={selectDistanceFilter} />
                        <HillButtons sendHillArray={selectHillFilter} />
                        <Row>{alert} {alert2} {alert3} {alert4} </Row>
                        </Col>
                        <Col md={3}>
                            <RouteList routesToAdd={this.state.routeToAdd} onRouteSelect={selectRoute}
                            />
                        </Col>
                        <Col md={6}>
                            <div className="custom-map">
                                <Map google={window.google}
                                initialCenter={{ lat: 43.0435794, lng: -88.0138458 }}
                                    zoom={12}
                            >
                                {route1Markers}
                                {route2Markers}
                                    <Polyline
                                        strokeWeight={6}
                                        path={this.state.route1.coordinates} />
                                    <Polyline
                                        strokeWeight={6}
                                        path={this.state.route2.coordinates} />
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
})(SelectRoutes)


