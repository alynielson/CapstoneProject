import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';

export class DistanceButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [
                { name: '0-5', isActive: false },
                { name: '5-10', isActive: false },
                { name: '10-20', isActive: false },
                { name: '20-30', isActive: false },
                { name: '30-50', isActive: false },
                { name: '50-75', isActive: false },
                { name: '75+', isActive: false}

            ]
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick(index) {
        let tmp = this.state.buttons;
        tmp[index].isActive = !tmp[index].isActive;
        this.setState({ buttons: tmp });
        this.props.sendDistanceArray(this.state.buttons.filter(a => a.isActive === true).map(a => a.name));
    }

    render() {
        return (
            <FormGroup>
                <ControlLabel>Filter by distance (in miles):</ControlLabel>
                <ButtonToolbar>
                    {this.state.buttons.map((el, index) =>
                        <Button key={index} onClick={() => this.onClick(index)} active={this.state.buttons[index].isActive}>
                            {el.name}
                        </Button>
                    )}
                </ButtonToolbar>
            </FormGroup>
            
            
            );



    }


}