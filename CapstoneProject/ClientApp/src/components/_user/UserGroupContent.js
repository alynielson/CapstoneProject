import React, { Component } from 'react';
import { Tooltip, OverlayTrigger, ListGroup, ListGroupItem, ButtonGroup, Button, Col, ColProps, Row, Glyphicon } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import { CreateGroup } from './CreateGroup';
import { EditGroup } from './_groups/EditGroup';
import { ViewGroup } from './_groups/ViewGroup';


export class UserGroupContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createGroup: false,
            groupsIn: [],
            groupsOwn: [],
            editingGroupId: null,
            viewingGroupId: null,
            name: '',
            city: '',
            state: '',
            description: '',
            memberIds: [],
            memberNames: [],
            userId: null,
            owner: '',
            viewingGroupDetails: "About"
            
        }
        this.addNewGroup = this.addNewGroup.bind(this);
        this.backToAllGroups = this.backToAllGroups.bind(this);
        this.goEditGroup = this.goEditGroup.bind(this);
        this.goViewGroup = this.goViewGroup.bind(this);
        this.changeViewingDetails = this.changeViewingDetails.bind(this);
    }

    changeViewingDetails(tab) {
        this.setState({
            viewingGroupDetails: tab
        });
    }

    goEditGroup() {
        let index = this.state.canEditGroup;
        var groupId = this.state.groupsOwn[index].id;
        fetch(`/api/Groups/GetGroupDetails?id=${groupId}`).then(response => response.json()).then(data =>
            this.setState({
                name: data.name,
                city: data.city,
                state: data.state,
                description: data.description,
                memberIds: data.members,
                memberNames: data.memberNames,
                owner: data.owner,
                userId: data.userId,
                editingGroupId: groupId

            }))
            .catch(error => console.log(error));

    }

    goViewGroup(index, list) {
        var groupId = (list === "in") ? this.state.groupsIn[index].id : this.state.groupsOwn[index].id;
        var canEdit = (list === "own") ? index : null;
        fetch(`/api/Groups/GetGroupDetails?id=${groupId}`).then(response => response.json()).then(data =>
            this.setState({
                name: data.name,
                city: data.city,
                state: data.state,
                description: data.description,
                memberIds: data.members,
                memberNames: data.memberNames,
                owner: data.owner,
                userId: data.userId,
                viewingGroupId: groupId,
                viewingGroupDetails:"About",
                canEditGroup: canEdit
            }))
            .catch(error => console.log(error));

    }

    addNewGroup(event) {
        event.preventDefault();
        this.setState({
            createGroup: true,
        })
    }

   async backToAllGroups() {
        let groupsIn;
        let groupsOwn;
        var id = localStorage.getItem('userId');
        await fetch(`/api/Groups/GetGroups?id=${id}`).then(response => response.json())
            .then(data => {

                groupsIn = data.groupsIn;
                groupsOwn = data.groupsOwn;
                this.setState({
                    groupsIn: groupsIn,
                    groupsOwn: groupsOwn,
                    
                })
           }).catch(a => console.log(a));
       this.setState({
           createGroup: false,
           editingGroupId: null,
           viewingGroupId: null
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
        const style = {
            backgroundColor: "purple",
            height: "85vh",
        };
        const tooltip = (
            <Tooltip id="tooltip">
                You're the organizer of this group!
            </Tooltip>
        );
        let viewGroup = null;
        let viewGroupButtons = null;
        let editGroup = null;
        if (this.state.viewingGroupId != null) {
            viewGroup = <ViewGroup
                name={this.state.name}
                city={this.state.city}
                state={this.state.state}
                description={this.state.description}
                memberIds={this.state.memberIds}
                userId={this.state.userId}
                owner={this.state.owner}
                memberNames={this.state.memberNames}
                id={this.state.editingGroupId}
                viewingGroupDetails={this.state.viewingGroupDetails}
            />
            if (this.state.canEditGroup !== null) {
                editGroup = <a className="btn action-button" onClick={() => this.goEditGroup()}>Edit Group</a>
            }
            viewGroupButtons = <ButtonGroup vertical>
                <Button onClick={() => this.changeViewingDetails("About")} active={this.state.viewingGroupDetails === "About"}>About</Button>
                <Button onClick={() => this.changeViewingDetails("Members")} active={this.state.viewingGroupDetails === "Members"}>Members</Button>
                <Button onClick={() => this.changeViewingDetails("Events")} active={this.state.viewingGroupDetails === "Events"}>Events</Button>
            </ButtonGroup>
        }
        const returnToEvents = this.backToAllGroups;
        var groupsOwn = this.state.groupsOwn;
        var groupsIn = this.state.groupsIn;
        if (this.state.createGroup) {
            return (
                <div>
                    <CreateGroup returnToEventHome={returnToEvents}/>
                    
                    </div>);
        }
        else if (this.state.editingGroupId !== null) {
            return (
                <EditGroup
                    name={this.state.name}
                    city={this.state.city}
                    state={this.state.state}
                    description={this.state.description}
                    memberIds={this.state.memberIds}
                    userId={this.state.userId}
                    owner={this.state.owner}
                    memberNames={this.state.memberNames}
                    id={this.state.editingGroupId}
                    returnToEventHome={returnToEvents} />
            );
        }
       
        else {
            
          
            return (
                <div style={style}> 
                    <Row className="empty-space5percent" />
                    <Row>
                        <Col md={2} mdOffset={1} >
                            <a className="btn action-button" onClick={(event) => this.addNewGroup(event)}>Create a Group</a>
                            </Col>
                        </Row>
                    
                    <Row>
                        <Col md={4} mdOffset={1}>
                            <h3 className="page-subtitle">Your Groups</h3>
                            <ListGroup>
                                {this.state.groupsOwn.map((a, index) =>
                                    (<ListGroupItem key={index} onClick={() => this.goViewGroup(index, "own")} active={this.state.viewingGroupId === a.id} value={a.id}>
                                        {a.name}
                                        <span className="pull-right">
                                            <OverlayTrigger placement="right" overlay={tooltip}>
                                                <Glyphicon glyph="star" />
                                            </OverlayTrigger>
                                        </span>
                                    </ListGroupItem>)
                                )}
                                {this.state.groupsIn.map((a, i) =>

                                    (<ListGroupItem onClick={() => this.goViewGroup(i,"in")} key={i} value={a.id} active={this.state.viewingGroupId === a.id}>{a.name}</ListGroupItem>)
                                )}
                               
                                </ListGroup>
                        </Col>
                        <Col md={4} mdOffset={1}>
                            {viewGroup}
                        </Col>
                        <Col md={1}>
                            {viewGroupButtons}
                            </Col>
                    </Row>
                    
                    <Row>
                        <Col md={2} mdOffset={7}>
                        {editGroup}
                    </Col></Row>
                    </div>


        );
        }
    }



}