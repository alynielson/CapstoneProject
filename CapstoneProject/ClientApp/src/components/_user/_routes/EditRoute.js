import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Col, ButtonGroup, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import { CommentModal } from './CommentModal';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png'

export class EditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowComment: false,
            commentCoords: [{}],
            hasComments: false,
            showCommentModal: false,
            pointComments: [],
            commentShowing: null,
            commentPosition: null,
            pathCommentCoords: [{}],
            pathTempSpot: null,
            allowPathComment: false,
            hasPathComments: false
        }
        this.allowComment = this.allowComment.bind(this);
        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.onMarkerHover = this.onMarkerHover.bind(this);
        this.dismissComment = this.dismissComment.bind(this);
        this.clickFoPathComment = this.clickForPathComment.bind(this);
        this.allowPathComment = this.allowPathComment.bind(this);
    }

    onMarkerHover(data) {
        
        let latitude = data.position.lat;
        let longitude = data.position.lng;
        let commentArray = this.state.commentCoords;
        let commentPosition = commentArray.findIndex(a => a.lat == latitude && a.lng == longitude);
        let commentToShow = this.state.pointComments[commentPosition];
        this.setState({
            commentShowing: commentToShow,
            commentPosition: commentPosition
        });
    }

    dismissComment(){
        this.setState({
            commentShowing: null,
            commentPosition: null
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

    clickForPathComment(coord) {
        
            if (this.state.pathTempSpot === null) {
                this.setState({
                    pathTempSpot: coord
                });
            }
            else {
                var point1ToAdd = this.state.pathTempSpot;
                var point2ToAdd = coord;
                if (this.state.hasPathComments === false) {
                    
                    this.setState({
                        hasPathComments: true,
                        pathCommentCoords: [{ point1ToAdd, point2ToAdd }],
                        pathTempSpot: null,
                        allowPathComment: false
                    });
                }
                else {
                    var newPath = { point1ToAdd, point2ToAdd };
                    var currentPaths = this.state.pathCommentCoords;
                    currentPaths.push(newPath);
                    this.setState({
                        pathCommentCoords: currentPaths,
                        pathTempSpot: null,
                        allowPathComment: false
                    });
                }

            }
    }

    clickOnPath(t, map, c) {
        if (this.state.allowComment || this.state.allowPathComment) {
            const { latLng } = c;
            const lat = latLng.lat();
            const lng = latLng.lng();
            const newCoord = { lat: lat, lng: lng };
            if (this.state.allowPathComment === true) {
                this.clickForPathComment(newCoord);
            }
            else if (this.state.hasComments === false) {
                 this.setState({
                    allowComment: false,
                    commentCoords: [newCoord],
                    hasComments: true,
                    showCommentModal: true
                });
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

    allowPathComment() {
        this.setState({
            allowPathComment: true
        });
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
                                    if (this.state.commentPosition === index) {
                                        return (
                                            <Marker key={index}
                                                icon={img2}
                                                onMouseover={(data) => this.onMarkerHover(data)}
                                                google={window.google}
                                                position={coord}
                                            />
                                        );
                                    }
                                    else {
                                        return (
                                            <Marker key={index}
                                                icon={img1}
                                                onMouseover={(data) => this.onMarkerHover(data)}
                                                google={window.google}
                                                position={coord}
                                            />
                                            
                                            );
                                    }
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
                           
                            
                            <Button onClick={this.allowComment}>Point</Button>
                            <Button onClick={this.allowPathComment}>Segment</Button>
                           
                            
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