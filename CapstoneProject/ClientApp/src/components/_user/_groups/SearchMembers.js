import React, { Component } from 'react';
import { Button, Checkbox, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';


export class SearchMembers extends Component {
    constructor(props){
        super(props);
        this.state = {
            filter: 'name',
            term1: '',
            term2: '',
            term3: '',
            term4: '',
            states: [],
            nameSearch: true,
            locationSearch: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.onClickingSearch = this.onClickingSearch.bind(this);
    }

    componentDidMount() {
        fetch("api/Users/GetStatesList")
            .then(response => { return response.json(); })
            .then(data => {
                let statesToSelect = data.map(state => { return { value: state, display: state } });
                this.setState({ states: [{ value: '', display: '' }].concat(statesToSelect) });
            })
            .catch(error => console.log(error));
        this.setState({ userId: localStorage.getItem('userId') });
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleCheckboxChange(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
        var value2;
        if (value === true) {
            if (this.state.filter === 'name' || this.state.filter === 'location') {
                value2 = 'both';
            }
            else if (this.state.filter === '' && target.name === 'nameSearch') {
                value2 = 'name';
            }
            else {
                value2 = 'location';
            }


        }
        else {
            if (this.state.filter === 'both' && target.name === 'nameSearch') {
                value2 = 'location';
            }
            else if (this.state.filter === 'both' && target.name === 'locationSearch') {
                value2 = 'name';
            }
            else {
                value2 = '';
            }
        }

        this.setState({
            [name]: value,
            filter: value2,
            term1: '',
            term2: '',
            term3: '',
            term4: ''
        });
        
    }

    onClickingSearch(event) {
        event.preventDefault();

        this.props.onSearchEnter(this.state.filter, this.state.term1, this.state.term2, this.state.term3, this.state.term4)
    }
    


    render() {
        let SearchForm;
        if (this.state.filter === 'name') {
            SearchForm = (<div><FormGroup>
                <ControlLabel>First Name</ControlLabel>
                <FormControl

                    type="text"
                    name="term1"
                    value={this.state.term1}
                    onChange={this.handleChange}
                />
            </FormGroup>
                <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                        type="text"
                        name="term2"
                        value={this.state.term2}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <Button onClick={(event) => this.onClickingSearch(event)}>Search</Button>
            </div>);
        }
        else if (this.state.filter === 'location') {
            SearchForm = <div><FormGroup>
                <ControlLabel>City</ControlLabel>
                <FormControl
                    type="text"
                    name="term1"
                    value={this.state.term1}
                    onChange={this.handleChange}
                />
                <ControlLabel>State</ControlLabel>
                <FormControl
                    componentClass="select"
                    name="term2"
                    value={this.state.term2}
                    onChange={this.handleChange}
                >
                    {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}

                </FormControl>

            </FormGroup>                <Button onClick={(event) => this.onClickingSearch(event)}>Search</Button>
</div>
        }
        else if (this.state.filter === 'both'){
            SearchForm = <div><FormGroup>
                <ControlLabel>First Name</ControlLabel>
                <FormControl

                    type="text"
                    name="term3"
                    value={this.state.term3}
                    onChange={this.handleChange}
                />
            </FormGroup>
                <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                        type="text"
                        name="term4"
                        value={this.state.term4}
                        onChange={this.handleChange}
                    />
                </FormGroup><FormGroup>
                    <ControlLabel>City</ControlLabel>
                    <FormControl
                        type="text"
                        name="term1"
                        value={this.state.term1}
                        onChange={this.handleChange}
                    />
                    <ControlLabel>State</ControlLabel>
                    <FormControl
                        componentClass="select"
                        name="term2"
                        value={this.state.term2}
                        onChange={this.handleChange}
                    >
                        {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}

                    </FormControl>

                </FormGroup>                 <Button onClick={(event) => this.onClickingSearch(event)}>Search</Button>
</div>
        }
        return (
            <Form>
                
                  <FormGroup>
                    <ControlLabel>Search For Members to Add By:</ControlLabel>
                    <Checkbox inline

                        checked={this.state.nameSearch}
                        name="nameSearch"
                        onChange={this.handleCheckboxChange}

                    > Name </Checkbox>
                    <Checkbox inline

                        name="locationSearch"
                        checked={this.state.locationSearch}
                        onChange={this.handleCheckboxChange}
                     > Location </Checkbox>
                </FormGroup>
                {SearchForm}
            </Form>
            );


    }





}