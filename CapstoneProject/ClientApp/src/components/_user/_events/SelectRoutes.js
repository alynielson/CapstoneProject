import React, { Component } from 'react';
import { Button, Form, OverlayTrigger, Glyphicon, Tooltip, Col, ColProps, Row, ButtonToolbar,Alert} from 'react-bootstrap';
import { SearchRoutes } from '../_routes/SearchRoutes';
import { RouteList } from '../_routes/RouteList';
import { DistanceButtons } from '../_routes/DistanceButtons';
import { HillButtons } from '../_routes/HillButtons';
import _ from 'lodash';
import { RouteMap } from '../_mapComponents/RouteMap';
import { RouteInfo } from './RouteInfo';
import { RouteComments } from '../_mapComponents/RouteComments';
import { RouteChoiceButtons } from '../_mapComponents/RouteChoiceButtons';
import { SelectStartingPoint } from './SelectStartingPoint'; 

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
            addressCoords: null,
            route1Details: '',
            route2Details: '',
            automaticAddress: false,
            viewSearch: true,
            viewComments: false
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
        this.addStart = this.addStart.bind(this);
        this.changeDetails = this.changeDetails.bind(this);
        this.changeAddress = this.changeAddress.bind(this);
        this.hideUnhideSearch = this.hideUnhideSearch.bind(this);
        this.hideUnhideComments = this.hideUnhideComments.bind(this);
    }

    hideUnhideSearch() {
        let current = this.state.viewSearch;
        let viewComments = (!current) ? false : this.state.viewComments;
        let comments = (current) ? [{ position: -1, author: null, comment: null }, { position: -1, author: null, comment: null }] : this.state.comments;
        this.setState({
            viewSearch: !current,
            viewComments: viewComments,
            comments: comments
        })
    }

    hideUnhideComments() {
        let current = this.state.viewComments;
        let viewSearch = (!current) ? false : this.state.viewSearch;
        let comments = (current) ? [{ position: -1, author: null, comment: null}, { position: -1, author: null, comment: null }] : this.state.comments;
        this.setState({
            viewComments: !current,
            viewSearch: viewSearch,
            comments: comments
        })
    }
    addStart(t, map, coord) {
        if (this.state.hasSelected) {
            const { latLng } = coord;
            const lat = latLng.lat();
            const lng = latLng.lng();
            const newCoord = { lat: lat, lng: lng };
            this.setState({
                automaticAddress: true,
                addressCoords: newCoord,
                address: "Selected on map"
            })
        }
    }

    changeAddress(address) {
        this.setState({
            address: address
        })
    }

    changeDetails(detail, number) {
        switch (number) {
            case (1):
                this.setState({
                    route1Details: detail
                });
                break;
            case (2):
                this.setState({
                    route2Details: detail
                })
                break;
        }
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
        if (this.state.viewComments) {
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

    getWhichRoute(){
        switch (this.state.routeShowing.routeSpot) {
            case (1):
                return this.state.route1;
            case (2):
                return this.state.route2;
        }
    }

    onMarkerHover(data) {
        if (this.state.viewComments){
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

    viewRoute(routeNumber) {
        let currentShowing = this.state.routeShowing;
        
        if (this.state.routesViewing <= 1 && currentShowing.routeSpot !== routeNumber && currentShowing.values === true) {
            currentShowing.values = false;
        }
        else if (this.state.routesViewing === 1 && currentShowing.routeSpot !== routeNumber && currentShowing.values === false) {
            currentShowing.values = true;
        }
        currentShowing.routeSpot = routeNumber;
        this.setState({
            routeShowing: currentShowing,
            comments: [{ position: -1, author: null, comment: null }, {position: -1, author: null, comment: null}]
        })
    }

    render() {
        const infoBox = {
           
                backgroundColor: "#c2e6ff",
               marginTop: "10px",
                paddingLeft: "15px",
                paddingRight: "15px",
                color: "#555",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                overflow: "auto",
                marginBottom: "10px",
                boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
                borderRadius: "5px"
            
        }
        const routeSearch = _.debounce((term2) => { this.searchTest(term2) }, 500);
        const selectDistanceFilter = ((value) => { this.setDistanceFilter(value) });
        const selectHillFilter = ((value) => { this.setHillFilter(value) });
        const selectRoute = ((selectedRoute) => { this.getRouteToEdit(selectedRoute) });
        const addStartPin = ((t, map, coord) => { this.addStart(t, map, coord) });
        const viewPointComment = ((data) => { this.onMarkerHover(data) });
        const viewPathComment = ((data) => { this.onPathHover(data) });
        var search = null;
        var list = null;
        var nextButton = null;
        if (!this.state.hasSelected) {
            nextButton = <a className="btn action-button" onClick={this.finish}>Finish</a>
        }
        if (!this.state.hasSelected && this.state.viewSearch) {
            search = <div><SearchRoutes onSearchEnter={routeSearch} />
                <DistanceButtons sendDistanceArray={selectDistanceFilter} />
                <HillButtons sendHillArray={selectHillFilter} />
            </div>
           
            list = <RouteList routesToAdd={this.state.routeToAdd} onRouteSelect={selectRoute} />
        }
        let finishButton = null;
        var finish = null;
        if (this.state.hasSelected) {
            finish = <div>
                <SelectStartingPoint changeAddress={this.changeAddress} automaticAddress={this.state.automaticAddress}/>
            </div>
        }
        let routeComments = null;
        if ((this.state.comments[0].comment !== null || this.state.comments[1].comment !== null) && this.state.viewComments) {
            routeComments =
                <RouteComments comments={this.state.comments} dismissPointComment={() => this.dismissPointComment()}
                    dismissPathComment={() => this.dismissPathComment()} style={infoBox} createEvent={true}/>
        }
        let routeDetails = <RouteInfo style={infoBox} hasSelected={this.state.hasSelected} hasFinished={false} route1={this.state.route1} route2={this.state.route2}
                route1Details={this.state.route1Details} route2Details={this.state.route2Details} routeShowing={this.state.routeShowing}
                onDetailsChanging={this.changeDetails} />
        
        let closeSearch = null;
        let tooltip = (
            <Tooltip id="tooltip">
                Hide search
            </Tooltip>
        );
        let searchFilterIcon = <OverlayTrigger placement="top" overlay={tooltip}>
            <Glyphicon className="minus-icon" glyph="minus" />
        </OverlayTrigger>
        if (!this.state.viewSearch) {
            tooltip = <Tooltip id="tooltip">
               Back to searching
            </Tooltip>
            searchFilterIcon = <OverlayTrigger placement="top" overlay={tooltip}>
                <Glyphicon className="minus-icon" glyph="plus" />
            </OverlayTrigger>
        }
        if (this.state.routesViewing > 0 && !this.state.hasSelected) {
            closeSearch = <a onClick={this.hideUnhideSearch} >
                <span >
                    {searchFilterIcon}
                    </span>
                </a> 
        }
        let commentIcon = null;
        if ((this.state.routesViewing > 0 && this.state.routeShowing.values === true) &&
            ((this.state.routeShowing.routeSpot === 1 && (this.state.route1.pointComments.length > 0 || this.state.route1.pathComments.length > 0))
                || (this.state.routeShowing.routeSpot === 2 && (this.state.route2.pointComments.length > 0 || this.state.route2.pathComments.length > 0)))) {
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
        if (!this.state.hasSelected) {
            finishButton = <a className="btn action-button under-map" onClick={this.finish}>Next</a>
        }
        else {
            finishButton = <a className="btn action-button under-map" onClick={() => this.props.onCompleting(this.state.address, this.state.route1.currentRouteId, this.state.route2.currentRouteId, this.state.route1Details, this.state.route2Details, this.state.addressCoords)}>Finish</a>
        }
        return (
            <div>

                <Row>
                    <Col md={1}>
                        {closeSearch}
                        </Col>
                    <Col md={3}>
                        {finish}
                        {search}
                        <Row>
                            <Col md={6}>
                        <RouteChoiceButtons routesViewing={this.props.numberOfRoutes} routeShowing={this.state.routeShowing}
                                    viewRoute={(routeNumber) => this.viewRoute(routeNumber)} />
                            </Col>
                            <Col md={1}>
                                {commentIcon}
                                </Col>
                            </Row>
                        {routeDetails}
                       
                    </Col>
                    <Col md={2}>
                        <Row>
                            
                        </Row>
                        {list}
                        {routeComments}
                    </Col>
                    <Col md={5}>
                        <Row>
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
                                    viewComments={this.state.viewComments}
                                />
                            </div>
                                </Row>
                            
                           
                        
                    </Col>
                    <Col md={2} mdOffset={9}>
                    <Row>
                            {finishButton}

                    </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
