import React, { Component } from 'react';
import { Button, Tooltip,OverlayTrigger, Alert, Col, ButtonGroup, Row, Glyphicon } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, Marker } from 'google-maps-react';
import { CommentModal } from './CommentModal';
import img1 from './icons/not_clicked_marker.png';
import img2 from './icons/_clicked_marker.png';
import { PathCommentModal } from './PathCommentModal';
import { RouteInfo } from './RouteInfo';

export class EditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowComment: false,
            commentCoords: [{}],
            hasComments: false,
            isViewingRouteInfo: true,
            showCommentModal: false,
            pointComments: [],
            commentShowing: null,
            commentPosition: null,
            pathCommentCoords: [{}],
            pathTempSpot: null,
            allowPathComment: false,
            hasPathComments: false,
            showPathCommentModal: false,
            pathComments: [],
            pathCommentShowing: null,
            pathCommentPosition: null,
            pathUserNames: [],
            commentUserNames: []
        }
        this.allowComment = this.allowComment.bind(this);
        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.dismissComment = this.dismissComment.bind(this);
        this.clickForPathComment = this.clickForPathComment.bind(this);
        this.allowPathComment = this.allowPathComment.bind(this);
        this.handlePathCommentSubmit = this.handlePathCommentSubmit.bind(this);
        this.dismissPathComment = this.dismissPathComment.bind(this);
        this.onPathHover = this.onPathHover.bind(this);
        this.onMarkerHover = this.onMarkerHover.bind(this);
        this.hideUnhideComments = this.hideUnhideComments.bind(this);
    }

    hideUnhideComments() {
        let result = this.state.isViewingRouteInfo;
        this.setState({
            isViewingRouteInfo: !result,
            allowComment: false,
            allowPathComment: false
        })
    }

    componentWillMount() {
        if (this.props.pointComments.length > 0 && this.props.pathComments.length > 0) {
            this.setState({
                commentCoords: this.props.pointCoordinates,
                hasComments: true,
                pointComments: this.props.pointComments,
                pathCommentCoords: this.props.pathCoordinates,
                hasPathComments: true,
                pathComments: this.props.pathComments,
                pathUserNames: this.props.pathCommentAuthors,
                commentUserNames: this.props.pointCommentAuthors
            })
        }
        else if (this.props.pointComments.length > 0) {
            this.setState({
                commentCoords: this.props.pointCoordinates,
                hasComments: true,
                pointComments: this.props.pointComments,
                commentUserNames: this.props.pointCommentAuthors
            })
        }
        else if (this.props.pathComments.length > 0) {
            this.setState({
                pathCommentCoords: this.props.pathCoordinates,
                hasPathComments: true,
                pathComments: this.props.pathComments,
                pathUserNames: this.props.pathCommentAuthors,
            })
        }
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

    dismissPathComment() {
        this.setState({
            pathCommentShowing: null,
            pathCommentPosition: null
        })
    }

    handleModalHide() {
        this.setState({
            showCommentModal: false,
            showPathCommentModal: false
        })
    }

    handleCommentSubmit(comment) {
        var currentComments = this.state.pointComments;
        currentComments.push(comment);
        var currentAuthors = this.state.commentUserNames;
        var author = `${localStorage.getItem('firstname')} ${localStorage.getItem('lastname')}`;
        currentAuthors.push(author);
        this.sendPointCommentToDb(comment, author);
        this.setState({
            showCommentModal: false,
            pointComments: currentComments,
            commentUserNames: currentAuthors
        });
    }

    sendPathCommentToDb(pathComment, author) {
        let routeId = this.props.routeId;
        let userId = localStorage.getItem('userId');
        var data = {
            notes: pathComment,
            pathCoordinates: this.state.pathCommentCoords[this.state.pathCommentCoords.length - 1],
            author: author,
            routeId: routeId,
            userId: userId
        };
        fetch('api/Routes/SavePathComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(error => console.log(error));
    }

    sendPointCommentToDb(comment, author) {
        let routeId = this.props.routeId;
        let userId = localStorage.getItem('userId');
        var data = {
            notes: comment,
            pointCoordinates: this.state.commentCoords[this.state.commentCoords.length - 1],
            author: author,
            routeId: routeId,
            userId: userId
        };
        fetch('api/Routes/SavePointComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(error => console.log(error));
    }

    handlePathCommentSubmit(pathComment) {
        var currentPathComments = this.state.pathComments;
        currentPathComments.push(pathComment);
        var currentAuthors = this.state.pathUserNames;
        var author = `${localStorage.getItem('firstname')} ${localStorage.getItem('lastname')}`;
        currentAuthors.push(author);
        this.sendPathCommentToDb(pathComment, author);
        this.setState({
            showPathCommentModal: false,
            pathComments: currentPathComments,
            pathUserNames: currentAuthors
        });
    }

    onPathHover(data) {
        let latitude1 = data.path[0].lat;
        let longitude1 = data.path[0].lng;
        let latitude2 = data.path[1].lat;
        let longitude2 = data.path[1].lng;
        let pathCommentArray = this.state.pathCommentCoords;
        let pathCommentPosition = pathCommentArray.findIndex(a => a[0].lat === latitude1 && a[0].lng === longitude1 && a[1].lat === latitude2 && a[1].lng === longitude2);
        let pathCommentToShow = this.state.pathComments[pathCommentPosition];
        this.setState({
            pathCommentShowing: pathCommentToShow,
            pathCommentPosition: pathCommentPosition
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
                        pathCommentCoords: [[ point1ToAdd, point2ToAdd ]],
                        pathTempSpot: null,
                        allowPathComment: false,
                        showPathCommentModal: true
                    });
                }
                else {
                    var newPath = [ point1ToAdd, point2ToAdd ];
                    var currentPaths = this.state.pathCommentCoords;
                    currentPaths.push(newPath);
                    this.setState({
                        pathCommentCoords: currentPaths,
                        pathTempSpot: null,
                        allowPathComment: false,
                        showPathCommentModal: true
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
            isViewingRouteInfo: false,
            allowComment: true,
            allowPathComment: false
        })
    }

    allowPathComment() {
        this.setState({
            isViewingRouteInfo: false,
            allowPathComment: true,
            allowComment: false
        });
    }

  

    render() {
        const commentIcon = {
            marginLeft: "15px",
            fontSize: "40px"
        }
        const submitComment = ((comment) => { this.handleCommentSubmit(comment) });
        const submitPathComment = ((pathComment) => { this.handlePathCommentSubmit(pathComment) });
        let routeInfo = null;
        if (this.state.isViewingRouteInfo) {
            routeInfo = <RouteInfo totalDistance={this.props.totalDistance} totalElevationGain={this.props.totalElevationGain} totalElevationLoss={this.props.totalElevationLoss}/>
        }
        let infoIcon = <Glyphicon glyph="info-sign" className="comment-icon" style={commentIcon} /> 
        let message = <Tooltip id="tooltip">
            Viewing route info.
            </Tooltip>
        
        if (this.state.isViewingRouteInfo && this.state.hasComments) {
            message = <Tooltip id="tooltip">
               This route has comments! Click to view.
            </Tooltip>
            infoIcon = <a onClick={this.hideUnhideComments}> <OverlayTrigger placement="bottom" overlay={message}>
                <Glyphicon className="comment-icon" glyph="comment" style={commentIcon}/>
            </OverlayTrigger> </a>
        }
        else if (!this.state.isViewingRouteInfo && this.state.hasComments) {
            message = <Tooltip id="tooltip">
                Back to route info.
            </Tooltip>
            infoIcon = <a onClick={this.hideUnhideComments}> <OverlayTrigger placement="bottom" overlay={message}>
                <Glyphicon className="comment-icon" glyph="info-sign" style={commentIcon} />
            </OverlayTrigger> </a>
        }

        var alert = null;
        var alert2 = null;
        if (this.state.commentShowing != null && !this.state.isViewingRouteInfo) {
            alert = <Alert onDismiss={this.dismissComment} className="comments"> 
                <h5>{this.state.commentUserNames[this.state.commentPosition]}</h5>
                <p> {this.state.commentShowing} </p> </Alert>
        }
        if (this.state.pathCommentShowing != null && !this.state.isViewingRouteInfo) {
            alert2 = <Alert onDismiss={this.dismissPathComment} className="comments">
                <h5>{this.state.pathUserNames[this.state.pathCommentPosition]}</h5>

                <p> {this.state.pathCommentShowing} </p> </Alert>
        }
        var segments = null;
        var markers = null;
        if (!this.state.isViewingRouteInfo) {
            segments = this.state.pathCommentCoords.map((path, index) => {
                if (this.state.hasPathComments) {
                    return (
                        <Polyline strokeWeight={6}
                            key={index}
                            path={path}
                            strokeColor="#80ff00"
                            onMouseover={(data) => this.onPathHover(data)}
                        />
                    );

                }

            }
            );
            markers =
                this.state.commentCoords.map((coord, index) => {
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
                });

        }
        
        return (
            <div>

                <Row>
                    <Col md={7}>
                        <CommentModal show={this.state.showCommentModal} hiding={this.handleModalHide} submitting={submitComment} />
                        <PathCommentModal show={this.state.showPathCommentModal} hiding={this.handleModalHide} submitting={submitPathComment} />
                    <div className="map">
                        <Map google={window.google}
                            initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
                                zoom={12}
                            >
                                {markers}

                                <Polyline
                                    strokeWeight={6}
                                    path={this.props.coordinates} onClick={(t, map, c) => this.clickOnPath(t, map, c)}
                                >
                                    
                                </Polyline>
                                
                                {segments}
                            </Map>
                            
                        </div>
                    </Col>
                    <Col md={1}>
                        <ButtonGroup vertical className="map-action-buttons">
                            <Button onClick={this.allowComment} active={this.state.allowComment}>Point</Button>
                            <Button onClick={this.allowPathComment} active={this.state.allowPathComment}>Segment</Button>
                            {infoIcon}

                        </ButtonGroup>
                    </Col>
                    <Col md={3}>
                        <Col md={11} mdOffset={1}>
                        <Row>
                            <h3 className="page-subtitle">{this.props.name}</h3>
                            <h4 className="page-subtitle">{this.props.description} </h4>
                            <h5 className="page-subtitle">Created by {this.props.owner}</h5>
                        </Row>
                        {alert}
                            {alert2}
                            {routeInfo}
                        </Col>
                        
                    </Col>
                    <Col md={1}>
                        <a className="btn action-button map-back2" onClick={this.props.returnToRouteHome}>Back</a>
                    </Col>
                </Row>
              
                
                    
               
            </div>
            
            );
        }
    
  }  
export default GoogleApiWrapper({
})(EditRoute)