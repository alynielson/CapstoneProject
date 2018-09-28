import React, { Component } from 'react';
import { Button, Checkbox, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';


export class SearchRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term2: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }



    onInputChange(term) {
        this.setState({ term2: term });
        this.props.onSearchEnter(this.state.term2);
    }


    render() {
        return (
            <FormGroup>
                <ControlLabel>Search for routes by location</ControlLabel>
                <FormControl
                    type="text"
                    name="term2"
                    value={this.state.term2}
                    onChange={(event) => this.onInputChange(event.target.value)}
                />
            </FormGroup>
        );

    }





}
