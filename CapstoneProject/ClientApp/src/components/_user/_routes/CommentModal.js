import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ButtonGroup, Row, ButtonToolbar, Modal } from 'react-bootstrap';

export class CommentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ''

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
                    <h3>New Note - Route Point</h3>
                    <Form>
                        <FormGroup>
                            <ControlLabel>Enter your note here.</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                name="comment"

                                value={this.state.comment}
                                onChange={this.handleChange} />
                        </FormGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.hiding}>Back</Button>
                    <Button bsStyle="primary" onClick={() => this.props.submitting(this.state.comment)}>Save</Button>
                </Modal.Footer>

            </Modal>

        );

    }

}