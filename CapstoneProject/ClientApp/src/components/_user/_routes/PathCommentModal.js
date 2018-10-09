import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ButtonGroup, Row, ButtonToolbar, Modal } from 'react-bootstrap';

export class PathCommentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathComment: ''

        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {


        return (

            <Modal show={this.props.show} dialogClassName="modal-form-custom">

                <Modal.Body>
                    <h3>New Note - Route Segment</h3>
                    <Form>
                        <FormGroup>
                            <FormControl
                                componentClass="textarea"
                                name="pathComment"
                                placeholder="Enter your note here."
                                value={this.state.pathComment}
                                onChange={this.handleChange} />
                        </FormGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.hiding}>Back</Button>
                    <Button bsStyle="primary" onClick={() => this.props.submitting(this.state.pathComment)}>Save</Button>
                </Modal.Footer>

            </Modal>

        );

    }

}