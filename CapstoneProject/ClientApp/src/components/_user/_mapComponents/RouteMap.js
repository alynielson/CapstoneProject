import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png';

export class RouteMap extends Component {

    render() {
        let routeToViewDetails;
        if (this.props.routeShowing.routeSpot === 1) {
            routeToViewDetails = this.props.route1;
        }
        else if (this.props.routeShowing.routeSpot === 2) {
            routeToViewDetails = this.props.route2;
        }
        var startingPoint = null;
        if (this.props.startingPointPosition != null) {
            startingPoint = <Marker position={this.props.startingPointPosition} />
        }
        var routeMarkers = null;
        var route1Line = null;
        var segments = null;
        if (this.props.routesViewing > 0 && this.props.viewComments === true) {
            if (this.props.routeShowing.values === true) {

                routeMarkers = (routeToViewDetails.pointCoordinates.map((coord, index) => {
                    return (
                        <Marker key={index}
                            google={window.google}
                            icon={(this.props.comments[0].position === index) ? img2 : img1}
                            onMouseover={(data) => this.props.viewPointComment(data)}
                            position={coord}
                        />
                    );
                }));

                segments = (routeToViewDetails.pathCoordinates.map((path, index) => {
                    return (
                        <Polyline strokeWeight={6}
                            key={index}
                            path={path}
                            strokeColor="#80ff00"
                            onMouseover={(data) => this.props.viewPathComment(data)}
                        />
                    );
                }
                ));
            }
        }
        if (this.props.routesViewing === 2 || (this.props.routeShowing.routeSpot === 1 && this.props.routeShowing.values === true) ||
        (this.props.routesViewing === 1 && this.props.routeShowing.values == false && this.props.routeShowing.routeSpot === 2)) {
            route1Line = <Polyline
                strokeWeight={6}
                path={this.props.route1.coordinates} />
        }


        var route2Line = null;
        if ((this.props.routeShowing.routeSpot === 2 && this.props.routeShowing.values === true) || this.props.routesViewing === 2 ||
            (this.props.routesViewing === 1 && this.props.routeShowing.values == false && this.props.routeShowing.routeSpot === 1)) {
            route2Line = <Polyline
                
                strokeWeight={6}
                path={this.props.route2.coordinates}
                strokeColor="#f442d9"/>
        }
        return (
            <Map google={window.google}
                initialCenter={{ lat: 43.0435794, lng: -88.0138458 }}
                zoom={12}
                onClick={this.props.clickAction}
            >
                {startingPoint}
                {routeMarkers}
                {route1Line}
                {route2Line}
                {segments}
            </Map>
        );
    }
} export default RouteMap;