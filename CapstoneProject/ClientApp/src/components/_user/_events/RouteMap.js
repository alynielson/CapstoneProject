import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png';

export default class RouteMap extends Component {

    render() {
        var startingPoint = null;
        if (this.props.startingPointPosition != null) {
            startingPoint = <Marker position={this.props.startingPointPosition} />
        }
        var route1Markers = null;
        var route1Line = null;
        var segments1 = null;
        if (this.props.routesViewing > 0) {
            route1Markers = (this.props.route1.pointCoordinates.map((coord, index) => {
                return (
                    <Marker key={index}
                        google={window.google}
                        icon={(this.props.commentPosition1 === index) ? img2 : img1}
                        onMouseover={(data, routeNumber) => this.props.viewPointComment1(data, 1)}
                        position={coord}
                    />
                );
            }));
            route1Line = <Polyline
                strokeWeight={6}
                path={this.props.route1.coordinates} />
            segments1 = (this.props.route1.pathCoordinates.map((path, index) => {
                return (
                    <Polyline strokeWeight={6}
                        key={index}
                        path={path}
                        strokeColor="#80ff00"
                        onMouseover={this.props.viewPathComment1}
                    />
                );
            }
            ));
        }
        var route2Markers = null;
        var route2Line = null;
        var segments2 = null;
        if (this.props.routesViewing > 1) {
            route2Markers = (this.props.route2.pointCoordinates.map((coord, index) => {
                return (
                    <Marker key={index}
                        google={window.google}
                        icon={(this.props.commentPosition2 === index) ? img2 : img1}
                        onMouseover={(data, routeNumber) => this.props.viewPointComment(data, 2)}
                        position={coord}
                    />
                );
            }));
            route2Line = <Polyline
                strokeWeight={6}
                path={this.props.route2.coordinates} />
            segments2 = (this.props.route2.pathCoordinates.map((path, index) => {
                return (
                    <Polyline strokeWeight={6}
                        key={index}
                        path={path}
                        strokeColor="#F39C12"
                        onMouseover={this.props.viewPathComment2}
                    />
                );
            }
            ));
        }
        return (
            <Map google={window.google}
                initialCenter={{ lat: 43.0435794, lng: -88.0138458 }}
                zoom={12}
                onClick={this.props.clickAction}
            >
                {startingPoint}
                {route1Markers}
                {route2Markers}
                {route1Line}
                {route2Line}
                {segments1}
                {segments2}
            </Map>
        );
    }
} 