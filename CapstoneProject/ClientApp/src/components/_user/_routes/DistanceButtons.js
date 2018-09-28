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
                { name: '75+', isActive: false }

            ]
        }
        this.onClick = this.onClick.bind(this);
    }

    async onClick(index) {
        let tmp = this.state.buttons;
        let newTmp = tmp.map(a => { return { name: a.name, isActive: false } });
        newTmp[index].isActive = !newTmp[index].isActive;
   
        await this.setState({ buttons: newTmp });
        let activeButton = this.state.buttons.filter(a => a.isActive === true);
        let valueToSend;
        if (activeButton.length === 0) {
            valueToSend = '';
        }
        else {
            valueToSend = activeButton[0].name;
        }
        this.props.sendDistanceArray(valueToSend);
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