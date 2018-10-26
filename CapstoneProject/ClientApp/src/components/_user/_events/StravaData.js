import React, { Component } from 'react';
import { Table, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class StravaData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routeAResults: [],
            routeAnalysis: []
        }
        this.calculations = this.calculations.bind(this);
    }

   

     async componentWillMount() {
        
             let url;
             let routeAResults = [];
             let routeBResults = [];
             if (this.props.route2 !== null) {
                 url = `/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}&time=${this.props.time}&lat1=${this.props.route1.coordinates[0].lat}&lng1=${this.props.route1.coordinates[0].lng}&lat2=${this.props.route2.coordinates[0].lat}&lng2=${this.props.route2.coordinates[0].lng}`;
             }
             else {
                 url = `/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}&time=${this.props.time}&lat1=${this.props.route1.coordinates[0].lat}&lng1=${this.props.route1.coordinates[0].lng}`;
             }
             await fetch(url).then(response => response.json()).then(data => {
                 let results = data.map(a => {
                     return {
                         link: this.createLink(a.activity.id),
                         name: a.username,
                         movingTime: this.convertSecondsToTime(a.activity.moving_time),
                         elapsedTime: this.convertSecondsToTime(a.activity.elapsed_time),
                         distance: this.convertDistanceToMiles(a.activity.distance),
                         averageSpeed: this.convertSpeedToMph(a.activity.average_speed),
                         maxSpeed: this.convertSpeedToMph(a.activity.max_speed)
                     }
                 });
                 routeAResults = results.filter(a => { return Math.abs(Number(a.distance) - this.props.route1.totalDistance) < 1 });
                 if (this.props.route2 !== null) {
                     routeBResults = results.filter(a => { return (Math.abs(Number(a.distance) - this.props.route2.totalDistance) < 1) });
                 }
                 this.setState({
                     results: results,
                     routeAResults: routeAResults,
                     routeBResults: routeBResults
                 })
             }).catch(error => console.log(error));
             if (routeAResults.length > 0) {
                 this.calculations(routeAResults, 1);
             }
             if (routeBResults.length > 0) {
                 this.calculations(routeBResults, 2);
             }
         
    }
    createLink(id) {
        let userId = id.toString();
        return "https://www.strava.com/activities/".concat(userId);
    }

   calculations(results, route) {
        let totalMiles = this.calculateTotalMiles(results);
       let totalMinutes = this.calculateTotalMinutes(results);
       let totalResults = this.calculateTotalResults(results);
       let maxSpeed = this.calculateMaxSpeed(results).maxSpeed;
       let maxUser = this.calculateMaxSpeed(results).username;
       let fastestTime = this.calculateFastestTime(results).movingTime;
       let fastestUser = this.calculateFastestTime(results).name;
       let data = {
           totalMiles: totalMiles,
           totalMinutes: totalMinutes,
           totalResults: totalResults,
           maxSpeed: maxSpeed,
           maxUser: maxUser,
           fastestTime: fastestTime,
           fastestUser: fastestUser
       }
       let routeAnalysis = this.state.routeAnalysis;
       if (route === 1) {
           routeAnalysis[0] = data;
       }
       else if (route === 2) {
           routeAnalysis[1] = data;
       }
       this.setState({
          routeAnalysis: routeAnalysis
        });
    }
    convertSecondsToTime(seconds) {
        if (seconds < 60) {
            return `${seconds} seconds`;
        }
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        if (minutes < 60) {
            if (remainingSeconds < 10) {
                remainingSeconds = `0${remainingSeconds}`
            }
            return `${minutes}:${remainingSeconds} minutes`;
        }
        let hours = Math.floor(seconds / 3600);
        let remainingMinutes = minutes % 60;
        if (remainingMinutes < 10) {
            remainingMinutes = `0${remainingMinutes}`
        }
        return `${hours}:${remainingMinutes}:${remainingSeconds} hours`;
    }

    convertDistanceToMiles(meters) {
        let miles = (meters / 1609.344).toFixed(2);
        return miles;
    }

    convertSpeedToMph(mps) {
        let mph = (mps * 3600 / 1609.344).toFixed(2);
        return mph;
    }
    calculateTotalMiles(results) {
        results = results.map(a => Number(a.distance));
        return results.reduce((total, num) => total + num);
    }
    calculateTotalMinutes(results) {
        results = results.map(a => {
            if (a.movingTime.includes("seconds")) {
                let seconds = a.movingTime.substr(0, 2);
                return (Number(seconds));
            }
            else if (a.movingTime.includes("minutes")) {
                let sliced = a.movingTime.split(":");
                let cutAt = sliced[1].indexOf(" ");
                sliced[1] = sliced[1].substring(0, cutAt);
                return (Number(sliced[0]) * 60 + Number(sliced[1]));
            }
            else {
                let slicedHours = a.movingTime.split(":");
                let cutAt = slicedHours[2].indexOf(" ");
                slicedHours[2] = slicedHours[2].substring(0, cutAt);
                return (Number(slicedHours[0]) * 3600 + Number(slicedHours[1]) * 60 + Number(slicedHours[2]));
            }
        });
        return (results.reduce((total, num) => total + num) / 60).toFixed(2);
    }
    calculateTotalResults(results) {
        return results.length;
    }
    calculateFastestTime(results) {
        return results[0];
    }
    calculateMaxSpeed(results) {
        let speeds = results.map(a => {
            return {
                username: a.name,
                maxSpeed: Number(a.maxSpeed)
            }
        });
        let sorted = speeds.sort((a, b) => (b.maxSpeed - a.maxSpeed));
        return sorted[0];
    }


   

   
    render() {
        
        
        const infoContainer = {


        }
        const linkStyle = {
            color: "#FC4C02"
        }
        const infoBox = {
            paddingTop: "12px",
            paddingBottom: "10px",
            backgroundColor: "#c2e6ff",
            marginTop: "10px",
            paddingLeft: "15px",
            paddingRight: "5px",
            marginRight: "-25px",
            color: "#555",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px"

        }
        const box2 = {
            paddingTop: "6px",
            paddingBottom: "10px",
            backgroundColor: "white",
            marginTop: "10px",
            paddingLeft: "15px",
            paddingRight: "5px",
            marginRight: "-25px",
            color: "#555",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px",
            color: "#555"
        }
        const tableStyle = {
            color: "#555"
        }
        if (this.state.routeAResults.length === 0) {
            return (
                <div className="page-subtitle text-center"> No results yet! </div>
            );
        }
        else if (this.state.routeAnalysis.length === 0) {
            return (<div className="page-subtitle text-center">Loading...</div>);
        }
        else {
            let routeViewing = (this.props.routeResultsView === 1) ? this.state.routeAResults : this.state.routeBResults;
            let dataAnalysis = (this.props.routeResultsView === 1) ? this.state.routeAnalysis[0] : this.state.routeAnalysis[1];
            let resultsView = null;
            switch (this.props.view) {
                case (1):
                    resultsView = <div style={infoContainer}>
                        <div style={infoBox}>Total miles logged: {dataAnalysis.totalMiles}</div>
                        <div style={infoBox}>Total minutes logged: {dataAnalysis.totalMinutes}</div>
                        <div style={infoBox}>Total results logged: {dataAnalysis.totalResults}</div>
                        <div style={infoBox}>Fastest time: {dataAnalysis.fastestTime}, by {dataAnalysis.fastestUser}</div>
                        <div style={infoBox}>Highest max speed: {dataAnalysis.maxSpeed} miles per hour, by {dataAnalysis.maxUser} </div>
                    </div>
                    break;
                case (2):
                    let rows = null;
                    if (routeViewing.length > 0) {
                        rows = routeViewing.map((a, i) => {
                            return (
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{a.name}</td>
                                    <td>{a.movingTime}</td>
                                    <td>{a.averageSpeed} mph</td>
                                    <td><a style={linkStyle}href={a.link} target="_blank">View on Strava</a></td>
                                </tr>
                            )
                        } );
                    
                    }
                    resultsView = <div style={box2}>
                        <Table hover style={tableStyle}>
                            
                            <tbody>
                                {rows}
                                </tbody>
                            </Table>
                    </div>
                    break;
            }
            return (
                resultsView
                );
            
        }
    }



}