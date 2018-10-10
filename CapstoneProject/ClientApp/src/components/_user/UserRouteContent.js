import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateRoute } from './_routes/CreateRoute';
import { EditRoute } from './_routes/EditRoute';
import { SearchRoutes } from './_routes/SearchRoutes';
import { RouteList } from './_routes/RouteList';
import { DistanceButtons } from './_routes/DistanceButtons';
import { HillButtons } from './_routes/HillButtons';
import _ from 'lodash';


export class UserRouteContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createRoute: false,
            editRoute: false,
            currentRouteId: null,
            coordinates: [{}],
            defaultLat: 43.0362012,
            defaultLng: -87.98582829999999,
            routeToAdd: [],
            distanceFilter: '',
            hillFilter: '',
            name: '',
            city: '',
            state:'',
            description: '',
            owner: '',
            totalDistance: '',
            totalElevationGain: '',
            totalElevationLoss: ''
        }
        this.addNewRoute = this.addNewRoute.bind(this);
        this.backToAllRoutes = this.backToAllRoutes.bind(this);
        this.editRoute = this.editRoute.bind(this);
        this.doneCreatingNew = this.doneCreatingNew.bind(this);
        this.setDistanceFilter = this.setDistanceFilter.bind(this);
        this.setHillFilter = this.setHillFilter.bind(this);
    }

    componentDidMount() {
        if (this.props.location.search) {
            var stravaParams = this.props.location.search.split('&');
            let code = stravaParams[1].slice(5);
            let id = localStorage.getItem('userId');
            let data = { auth_code: code, id: id };
            fetch('api/Users/SendCodeToStrava', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        }
    }

    setDistanceFilter(value) {
        this.setState({

            distanceFilter: value
        });
    }

    setHillFilter(value) {
        this.setState({
            hillFilter: value
        });
    }


    addNewRoute(event) {
        event.preventDefault();
        this.setState({
            createRoute: true,
        })
    }

    editRoute(event) {
        event.preventDefault();
        this.setState({
            editRoute: true,
        })
    }

    backToAllRoutes() {
        this.setState({
            createRoute: false,
            editRoute: false,
            currentRouteId: null
        })
    }

    doneCreatingNew(id) {
        this.getRouteToEdit(id);
    }


    getRouteToEdit(id) {
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
            this.setState({
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
                editRoute: true,
                createRoute: false,
                currentRouteId: id,
                pointComments: pointComments,
                pathComments: pathComments,
                pointCommentAuthors: pointCommentAuthors,
                pathCommentAuthors: pathCommentAuthors,
                pointCoordinates: pointCoordinates,
                pathCoordinates: pathCoordinates
            });
        }
        ).catch(error => console.log(error));

    }

    async addSelectedRoute(selectedRoute) {
        let id = selectedRoute.value;
        await this.getRouteToEdit(id);

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

   

    render() {
        const style = {
            backgroundColor: "purple",
            height: "85vh",
        };
        const routeSearch = _.debounce((term2) => { this.searchTest(term2) }, 500);
        const addRoute = ((selectedRoute) => { this.addSelectedRoute(selectedRoute) });
        const returnToRoutes = this.backToAllRoutes;
        const moveFromCreateToEdit = ((id) => { this.doneCreatingNew(id) });
        const selectDistanceFilter = ((value) => { this.setDistanceFilter(value) });
        const selectHillFilter = ((value) => { this.setHillFilter(value) });
        if (this.state.createRoute) {
            return (
                <div style={style}>
                    <CreateRoute onFinishing={moveFromCreateToEdit} returnToRouteHome={returnToRoutes} />
                </div>);
        }
        else if (this.state.editRoute) {
            return (
                <div style={style}>
                    <EditRoute routeId={this.state.currentRouteId} coordinates={this.state.coordinates}
                        returnToRouteHome={returnToRoutes}
                        lat={this.state.defaultLat}
                        lng={this.state.defaultLng}
                        city={this.state.city}
                        description={this.state.description}
                        name={this.state.name}
                        owner={this.state.owner}
                        state={this.state.state}
                        totalDistance={this.state.totalDistance}
                        totalElevationGain={this.state.totalElevationGain}
                        totalElevationLoss={this.state.totalElevationLoss}
                        pointComments={this.state.pointComments}
                        pathComments={this.state.pathComments}
                        pointCommentAuthors={this.state.pointCommentAuthors}
                        pathCommentAuthors={this.state.pathCommentAuthors}
                        pointCoordinates={this.state.pointCoordinates}
                        pathCoordinates={this.state.pathCoordinates}
                        returnToRouteHome={returnToRoutes}
                        />
                </div>
                );
                
        }
        else {
            return (
                <div style={style}>
                    <Row className="empty-space10percent" />
                    <Row>
                        <Col md={2} mdOffset={1}>
                                <a className="btn action-button" onClick={(event) => this.addNewRoute(event)}>Create a Route</a>
                        </Col>
                    </Row>
                    <Row className="empty-space5percent" />
                    <Col md={6}>
                    <Row>
                        <Col md={8} mdOffset={1}>

                        <SearchRoutes onSearchEnter={routeSearch} />
                        
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8} mdOffset={1}>
                            <DistanceButtons sendDistanceArray={selectDistanceFilter}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={11} mdOffset={1}>
                            <HillButtons sendHillArray={selectHillFilter}/>
                        </Col>
                    </Row>
                   
                    </Col>
                    <Row>
                        <Col md={5}>
                            <RouteList routesToAdd={this.state.routeToAdd}
                                onRouteSelect={addRoute} />
                        </Col>
                    </Row>
                </div>
                
            );
        }
    }




}