import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateGroup } from './CreateGroup';


export class UserGroupContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createGroup: false,
            groupNamesIn: [],
            groupIdsIn: [],
            groupNamesOwn: [],
            groupIdsOwn: []
            
        }
        this.addNewGroup = this.addNewGroup.bind(this);
        this.backToAllGroups = this.backToAllGroups.bind(this);
    }

    addNewGroup(event) {
        event.preventDefault();
        this.setState({
            createGroup: true,
        })
    }

    backToAllGroups() {
       
        this.setState({
             createGroup: false,
        })
    }

    componentDidMount() {
        let inName;
        let inId;
        let ownName;
        let ownId;
        var id = localStorage.getItem('userId');
        fetch(`/api/Groups/GetGroupsIn?id=${id}`).then(response => response.json())
            .then(data => {
                inName = data.map(a => a.Name);
                inId = data.map(a => a.Id);
                this.setState({
                    groupNamesIn: inName,
                    groupsIdsIn: inId
                })
            }).catch(a => console.log(a));
        fetch(`/api/Groups/GetGroupsOwn?id=${id}`).then(response => response.json())
            .then(data => {
                ownName = data.map(a => a.Name);
                ownId = data.map(a => a.Id);
                this.setState({
                    groupNamesOwn: ownName,
                    groupIdsOwn: ownId
                })
            }).catch(b => console.log(b));
    }



    render() {
        const returnToEvents = this.backToAllGroups;
        if (this.state.createGroup) {
            return (
                <div>
                    <CreateGroup returnToEventHome={returnToEvents}/>
                    
                    </div>);
        }
        else {
            return (
                <div>
                
                    <Button onClick={(event) => this.addNewGroup(event)}>Create a Group</Button>
                    <Row>
                        <Col md={4}>
                            <h3>Groups you're in</h3>

                        </Col>
                        <Col md={4}>
                            <h3>Groups you organize</h3>
                                </Col>
                    </Row>
                    </div>


        );
        }
    }



}