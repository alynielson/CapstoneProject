import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Col, ButtonGroup, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import { CommentModal } from './CommentModal';

export class EditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowComment: false,
            commentCoords: [{}],
            hasComments: false,
            showCommentModal: false,
            pointComments: [],
            commentShowing: null
        }
        this.allowComment = this.allowComment.bind(this);
        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.onMarkerHover = this.onMarkerHover.bind(this);
        this.dismissComment = this.dismissComment.bind(this);
    }

    onMarkerHover(data) {
        
        let latitude = data.position.lat;
        let longitude = data.position.lng;
        let commentArray = this.state.commentCoords;
        let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
        let commentToShow = this.state.pointComments[commentPosition];
        this.setState({ commentShowing: commentToShow });
    }

    dismissComment(){
        this.setState({
            commentShowing: null
        })
}

    handleModalHide() {
        this.setState({
            showCommentModal: false
        })
    }

    handleCommentSubmit(comment) {
        var currentComments = this.state.pointComments;
        currentComments.push(comment);
        this.setState({
            showCommentModal: false,
            pointComments: currentComments
        });
    }

    clickOnPath(t, map, c) {
        if (this.state.allowComment) {
            const { latLng } = c;
            const lat = latLng.lat();
            const lng = latLng.lng();
            const newCoord = { lat: lat, lng: lng };
            if (this.state.hasComments === false) {
                
                this.setState({
                    allowComment: false,
                    commentCoords: [newCoord],
                    hasComments: true,
                    showCommentModal: true
                    
                })
            }
            else {
                var currentCommentLocations = this.state.commentCoords;
                currentCommentLocations.push(newCoord);
                this.setState({
                    allowComment: false,
                    commentCoords: currentCommentLocations,
                    showCommentModal: true
                });

            }
        }
    }

    allowComment() {
        this.setState({
            allowComment: true
        })
    }

    render() {
        const submitComment = ((comment) => { this.handleCommentSubmit(comment) });
        var alert = null;
        if (this.state.commentShowing != null) {
            alert = <Alert bsStyle="info" onDismiss={this.dismissComment}> 
                <p> {this.state.commentShowing} </p> </Alert>
        }
        return (
            <div>
                <Row>
                    
                        <h1>{this.props.name}</h1>
                        <h4>{this.props.description} </h4>
                    <h6>Created by {this.props.owner}</h6>
                </Row><Row>
                    <Col md={7}>
                        <CommentModal show={this.state.showCommentModal} hiding={this.handleModalHide} submitting={submitComment}/>
                    <div className="map">
                        <Map google={window.google}
                            initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
                                zoom={12}

                            >
                                {this.state.commentCoords.map((coord, index) => {
                                    return (
                                        <Marker key={index}
                                            onMouseover={(data) => this.onMarkerHover(data)}
                                            google={window.google}
                                            position={coord}
                                        />
                                    );
                                })}

                                <Polyline
                                    strokeWeight={6}
                                    path={this.props.coordinates} onClick={(t, map, c) => this.clickOnPath(t, map, c)}
                                >
                                    
                                    </Polyline>
                            </Map>
                            
                        </div>
                    </Col>
                    <Col md={2}>
                        <ButtonGroup vertical>
                            <Button onClick={this.allowComment}>Add Comment</Button>
                            
                            <Button onClick={this.saveRoute} disabled={!(this.state.totalDistance > 0)}>Save</Button>
                        </ButtonGroup>

                    </Col>
                    <Col md={3}>
                        {alert}
                        
                        </Col>
               </Row>
                <Row>
                <ButtonToolbar className='map-buttons'>
                    <Button onClick={this.props.returnToRouteHome}>Back</Button>

                    </ButtonToolbar>
                    </Row>
                </div>
            
            );
        }
    
  }  
export default GoogleApiWrapper({
})(EditRoute)