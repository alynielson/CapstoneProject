import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ButtonGroup, Row, ButtonToolbar } from 'react-bootstrap';
import { GoogleApiWrapper, Map, Polyline, Marker} from 'google-maps-react';

export class EditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowComment: false,
            commentCoords: [{}],
            hasComments: false,
           
        }
        this.allowComment = this.allowComment.bind(this);
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
                    
                })
            }
            else {
                var currentCommentLocations = this.state.commentCoords;
                currentCommentLocations.push(newCoord);
                this.setState({
                    allowComment: false,
                    commentCoords: currentCommentLocations
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
   
        return (
            <div>
                <Row>
                    
                        <h1>{this.props.name}</h1>
                        <h4>{this.props.description} </h4>
                    <h6>Created by {this.props.owner}</h6>
                </Row><Row>
                    <Col md={7}>
                    <div className="map">
                        <Map google={window.google}
                            initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
                                zoom={12}

                            >
                                {this.state.commentCoords.map((coord, index) => {
                                    return (
                                        <Marker key={index}
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