import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateGroup } from './CreateGroup';


export class UserGroupContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createGroup: false,
            groupsIn: [],
            groupsOwn: []
            
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

    componentWillMount() {
        let groupsIn;
        let groupsOwn;
        var id = localStorage.getItem('userId');
        fetch(`/api/Groups/GetGroups?id=${id}`).then(response => response.json())
            .then(data => {

                groupsIn = data.groupsIn;
                groupsOwn = data.groupsOwn;
                this.setState({
                    groupsIn: groupsIn,
                    groupsOwn: groupsOwn
                })
            }).catch(a => console.log(a));
        
    }



    render() {
        const returnToEvents = this.backToAllGroups;
        var groupsOwn = this.state.groupsOwn;
        var groupsIn = this.state.groupsIn;
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
                            <ListGroup>
                            {groupsIn.map((a,i) => 
                                
                                    (<ListGroupItem key={i}value={a.id}>{a.name}</ListGroupItem>)
                                )}
                                </ListGroup>
                        </Col>
                        <Col md={4}>
                            <h3>Groups you organize</h3>
                            <ListGroup>
                               
                                    {groupsOwn.map((a,index) => 
                                    (<ListGroupItem key={index} value={a.id}>{a.name}</ListGroupItem>)
                                    )}
                                </ListGroup>
                                </Col>
                    </Row>
                    </div>


        );
        }
    }



}