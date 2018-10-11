import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar, Alert } from 'react-bootstrap';

export class StravaData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aTotalMiles: 0,
            aTotalMinutes:0 ,
            aTotalResults:0,
            aMaxSpeed: 0,
            aMaxUser: '',
            aFastestTime: '',
            aFastestUser: '',
            routeAResults: []
        }
        this.calculations = this.calculations.bind(this);
    }

     async componentWillMount() {
         let url;
         let routeAResults = [];
        if (this.props.route2 !== null) {
            url = `/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}&time=${this.props.time}&lat1=${this.props.route1.coordinates[0].lat}&lng1=${this.props.route1.coordinates[0].lng}&lat2=${this.props.route2.coordinates[0].lat}&lng2=${this.props.route2.coordinates[0].lng}`;
        }
        else {
            url = `/api/Events/GetStravaData?eventId=${this.props.id}&date=${this.props.date}&time=${this.props.time}&lat1=${this.props.route1.coordinates[0].lat}&lng1=${this.props.route1.coordinates[0].lng}`;
        }
        await fetch(url).then(response => response.json()).then(data => {
            let results = data.map(a => {
                return {
                    name: a.username,
                    movingTime: this.convertSecondsToTime(a.activity.moving_time),
                    elapsedTime: this.convertSecondsToTime(a.activity.elapsed_time),
                    distance: this.convertDistanceToMiles(a.activity.distance),
                    averageSpeed: this.convertSpeedToMph(a.activity.average_speed),
                    maxSpeed: this.convertSpeedToMph(a.activity.max_speed)
                }
            });
            routeAResults = results.filter(a => { return Math.abs(Number(a.distance) - this.props.route1.totalDistance) < 1 });
            let routeBresults = null;
            if (this.props.route2 !== null) {
                routeBresults = results.filter(a => { return (Math.abs(Number(a.distance) - this.props.route2.totalDistance) < 1) });
            }
            this.setState({
                results: results,
                routeAResults: routeAResults,
                routeBResults: routeBresults
            })
         }).catch(error => console.log(error));
         this.calculations(routeAResults);
      
    }

   calculations(results) {
        let aTotalMiles = this.calculateTotalMiles(results);
       let aTotalMinutes = this.calculateTotalMinutes(results);
       let aTotalResults = this.calculateTotalResults(results);
       let aMaxSpeed = this.calculateMaxSpeed(results).maxSpeed;
       let aMaxUser = this.calculateMaxSpeed(results).username;
       let aFastestTime = this.calculateFastestTime(results).movingTime;
       let aFastestUser = this.calculateFastestTime(results).name;
        this.setState({
            aTotalMiles: aTotalMiles,
            aTotalMinutes: aTotalMinutes,
            aTotalResults: aTotalResults,
            aMaxSpeed: aMaxSpeed,
            aMaxUser: aMaxUser,
            aFastestTime: aFastestTime,
            aFastestUser: aFastestUser
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
        //let results = (letter === "a") ? this.state.routeAResults : this.state.routeBResults;
        return results.length;
    }
    calculateFastestTime(results) {
        //let results = (letter === "a") ? this.state.routeAResults : this.state.routeBResults;
        return results[0];
    }
    calculateMaxSpeed(results) {
        //let results = (letter === "a") ? this.state.routeAResults : this.state.routeBResults;
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
        //let routeViewing = (this.props.routeResultsView === 1) ? "a" : "b";
        ////let totalMiles = this.calculateTotalMiles(routeViewing);
        //let resultsView = null;
        //switch (this.props.view) {
        //    case (1):
        //       resultsView =  
        //        break;
        //    case (2):
        //        resultsView = <div> results </div>
        //        break;
        //}
        
        const infoContainer = {


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
        if (this.state.routeAResults.length > 0) {
            return (
                <div style={infoContainer}>
                    <div style={infoBox}>Total miles logged: {this.state.aTotalMiles}</div>
                    <div style={infoBox}>Total minutes logged: {this.state.aTotalMinutes}</div>
                    <div style={infoBox}>Total results logged: {this.state.aTotalResults}</div>
                    <div style={infoBox}>Fastest time: {this.state.aFastestTime}, by {this.state.aFastestUser}</div>
                    <div style={infoBox}>Highest max speed: {this.state.aMaxSpeed} miles per hour, by {this.state.aMaxUser} </div>
                </div>
            );
        }
        else {
            return (<div>Loading</div>);
        }
    }



}