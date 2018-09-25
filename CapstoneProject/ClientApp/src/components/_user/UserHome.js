import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';

export class UserHome extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            
           
        }
      
    }



    componentDidMount() {
        if (this.props.location.search !== "") {
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

    

    render() {
        return (
            <div> User Home test </div>
            );
    }
}