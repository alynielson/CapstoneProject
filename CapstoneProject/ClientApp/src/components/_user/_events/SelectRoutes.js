import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar,Alert} from 'react-bootstrap';
import { SearchRoutes } from '../_routes/SearchRoutes';
import { RouteList } from '../_routes/RouteList';
import { DistanceButtons } from '../_routes/DistanceButtons';
import { HillButtons } from '../_routes/HillButtons';
import _ from 'lodash';
import RouteMap from '../_mapComponents/RouteMap';
import RouteInfo from './RouteInfo';
import RouteComments from '../_mapComponents/RouteComments';

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
            comments: [{ position: -1, author: null, comment: null }, {position: -1, author: null, comment: null}],
            routeShowing: { routeSpot: 1, values: false },
            addressCoords: null
        }
        this.setDistanceFilter = this.setDistanceFilter.bind(this);
        this.setHillFilter = this.setHillFilter.bind(this);
        this.getRouteToEdit = this.getRouteToEdit.bind(this);
        this.onPathHover = this.onPathHover.bind(this);
        this.onMarkerHover = this.onMarkerHover.bind(this);
        this.dismissPointComment = this.dismissPointComment.bind(this);
        this.dismissPathComment = this.dismissPathComment.bind(this);
        this.finish = this.finish.bind(this);
        this.viewRoute = this.viewRoute.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addStart = this.addStart.bind(this);
    }
    addStart(t, map, coord) {
        if (this.state.hasSelected) {
            const { latLng } = coord;
            const lat = latLng.lat();
            const lng = latLng.lng();
            const newCoord = { lat: lat, lng: lng };
            this.setState({
                address: "Selected on map",
                addressCoords: newCoord
            })
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    finish() {
        this.setState({
            hasSelected: true
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
 
    setDistanceFilter(value) {
        this.setState({
            distanceFilter: value
        });
    }
    onPathHover(data) {
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
        currentCommentsShowing[1] = {position: pathCommentPosition, author: pathCommentAuthor, comment: pathCommentToShow}
        this.setState({
            comments: currentCommentsShowing
        });
    }

    getWhichRoute(){
        switch (this.state.routeShowing.routeSpot) {
            case (1):
                return this.state.route1;
            case (2):
                return this.state.route2;
        }
    }

    onMarkerHover(data) {
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
        let route;
        fetch(`api/Routes/GetRoute?id=${id}`).then(response => response.json()).then(data => {
            route = {
                name: data.name,
                city: data.city,
                state: data.state,
                description: data.description,
                owner: data.ownerName,
                totalDistance: data.totalDistance,
                totalElevationGain: data.totalElevationGain,
                totalElevationLoss: data.totalElevationLoss,
                coordinates: data.coordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } }),
                pointCommentAuthors: data.pointCommentAuthors,
                pointComments: data.pointComments,
                pathCommentAuthors: data.pathCommentAuthors,
                pathComments: data.pathComments,
                pointCoordinates: data.pointCoordinates.map(a => { return { lat: parseFloat(a.lat), lng: parseFloat(a.lng) } }),
                pathCoordinates: data.pathCoordinates.map(a => {
                    return [
                        { lat: parseFloat(a[0].lat), lng: parseFloat(a[0].lng) },
                        { lat: parseFloat(a[1].lat), lng: parseFloat(a[1].lng) }
                    ]
                }),
                currentRouteId: id,
                defaultLat: Number(data.coordinates[0].lat),
                defaultLng: Number(data.coordinates[1].lng),
        };
            if (this.props.numberOfRoutes === 1 || (this.state.routesViewing === 0 && this.state.routeShowing.routeSpot === 1 && this.state.routeShowing.values === false) || (this.state.routesViewing === 1 && this.state.routeShowing.routeSpot === 1 && this.state.routeShowing.values === true)) {
                this.setState({
                    route1: route,
                    routesViewing: 1,
                    routeShowing: { routeSpot: 1, values: true },
                    comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }],
                });
            }
            else if ((this.state.routesViewing === 0 && this.state.routeShowing.routeSpot === 2 && this.state.routeShowing.values === false) || (this.state.routesViewing === 1 && this.state.routeShowing.routeSpot === 2 && this.state.routeShowing.values === true)) {
                this.setState({
                    route2: route,
                    routesViewing: 1,
                    routeShowing: { routeSpot: 2, values: true },
                    comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }],
                })
            }
            else if (this.state.routeShowing.routeSpot === 1) {
                this.setState({
                    route1: route,
                    routesViewing: 2,
                    routeShowing: { routeSpot: 1, values: true },
                    comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }],
                });
            }
            else if (this.state.routeShowing.routeSpot === 2) {
                this.setState({
                    route2: route,
                    routesViewing: 2,
                    routeShowing: { routeSpot: 2, values: true },
                    comments: [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }],
                });
            }
        }
        ).catch(error => console.log(error));
    }

    isRouteA() {
        return this.state.routeShowing.routeSpot === 1;
    }

    viewRoute(routeNumber) {
        let currentShowing = this.state.routeShowing;
        if (this.state.routesViewing <= 1 && currentShowing.routeSpot !== routeNumber && currentShowing.values === true) {
            currentShowing.values = false;
        }
        currentShowing.routeSpot = routeNumber;
        this.setState({
            routeShowing: currentShowing,
            comments: [{ position: -1, author: null, comment: null }, {position: -1, author: null, comment: null}]
        })
    }

    render() {
        const routeSearch = _.debounce((term2) => { this.searchTest(term2) }, 500);
        const selectDistanceFilter = ((value) => { this.setDistanceFilter(value) });
        const selectHillFilter = ((value) => { this.setHillFilter(value) });
        const selectRoute = ((selectedRoute) => { this.getRouteToEdit(selectedRoute) });
        const addStartPin = ((t, map, coord) => { this.addStart(t, map, coord) });
        const viewPointComment = ((data) => { this.onMarkerHover(data) });
        const viewPathComment = ((data) => { this.onPathHover(data) });
        var search = null;
        var list = null;
        if (!this.state.hasSelected) {

            search = <div><SearchRoutes onSearchEnter={routeSearch} />
                <DistanceButtons sendDistanceArray={selectDistanceFilter} />
                <HillButtons sendHillArray={selectHillFilter} />
                <Button onClick={this.finish}>Finish</Button>
            </div>

        }
        if (!this.state.hasSelected) {
            list = <RouteList routesToAdd={this.state.routeToAdd} onRouteSelect={selectRoute}
            />
        }
        var finalRoutes = null;
        if (this.props.numberOfRoutes === 2) {
            finalRoutes = <ButtonToolbar>
                <Button onClick={(routeNumber) => this.viewRoute(1)} active={this.isRouteA()}>Route A</Button>
                <Button onClick={(routeNumber) => this.viewRoute(2)} active={!this.isRouteA()}>Route B</Button>
            </ButtonToolbar>
        }
        var routeShowing = <div>
            <h4> Route A: {this.state.route1.name}</h4>
            <FormGroup>
                <ControlLabel>Distance:</ControlLabel>  {Number(this.state.route1.totalDistance).toFixed(2)} miles
            </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(this.state.route1.totalElevationGain).toFixed(2)} meters
            </FormGroup>
            <FormGroup>
                <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(this.state.route1.totalElevationLoss).toFixed(2)} meters
            </FormGroup>
            <FormGroup>
                <ControlLabel>Event Details for this Route</ControlLabel>
                <FormControl type='textarea' value={this.state.route1details} name="route1details" onChange={this.handleChange} />
            </FormGroup>
        </div>
        if (this.state.routeShowing.routeSpot === 2 && this.state.route2 !== null) {
            routeShowing = <div>
                <h4> Route B: {this.state.route2.name}</h4>
                <FormGroup>
                    <ControlLabel>Distance:</ControlLabel>  {Number(this.state.route2.totalDistance).toFixed(2)} miles
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Total Elevation Gain:</ControlLabel> {Number(this.state.route2.totalElevationGain).toFixed(2)} meters
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Total Elevation Loss:</ControlLabel> {Number(this.state.route2.totalElevationLoss).toFixed(2)} meters
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Event Details for this Route</ControlLabel>
                    <FormControl type='textarea' value={this.state.route2details} name="route2details" onChange={this.handleChange} />
                </FormGroup>
            </div>
        }
        var finishButton = <Button onClick={() => this.props.onCompleting(this.state.address, this.state.route1.currentRouteId, this.state.route2.currentRouteId, this.state.route1details, this.state.route2details, this.state.addressCoords)}>Finish</Button>
        var finish = null;
        if (this.state.hasSelected) {

            finish = <div>
                <FormGroup>
                    <ControlLabel>Where will you be starting?</ControlLabel>
                    <FormControl type="textarea" placeholder="Type an address or click a spot on the map" name="address" value={this.state.address} onChange={this.handleChange} />

                </FormGroup>
               
                {routeShowing}
                {finishButton}
            </div>
        }

        return (
            <div>
                <Row>
                    <Col md={3}>
                        {finish}
                        {search}
                        {finalRoutes}
                    </Col>
                    <Col md={3}>
                        <Row>
                            <RouteComments comments={this.state.comments} dismissPointComment={() => this.dismissPointComment()}
                                dismissPathComment={() => this.dismissPathComment()} />
                        </Row>
                        {list}
                    </Col>
                    <Col md={6}>
                        <div className="custom-map">
                            <RouteMap clickAction={addStartPin}
                                routeShowing={this.state.routeShowing}
                                startingPointPosition={this.state.addressCoords}
                                routesViewing={this.state.routesViewing}
                                route1={this.state.route1}
                                comments={this.state.comments}
                                viewPointComment={viewPointComment}
                                route2={this.state.route2}
                                viewPathComment={viewPathComment}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
