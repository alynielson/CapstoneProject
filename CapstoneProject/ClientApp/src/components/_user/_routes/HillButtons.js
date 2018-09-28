import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';

export class HillButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [
                { name: '200 or less', isActive: false },
                { name: '200-500', isActive: false },
                { name: '500-1000', isActive: false },
                { name: '1000-2000', isActive: false },
                { name: '2000+', isActive: false },
                { name: 'more downhill than uphill', isActive: false },
                

            ]
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick(index) {
        let tmp = this.state.buttons;
        tmp[index].isActive = !tmp[index].isActive;
        this.setState({ buttons: tmp });
        this.props.sendHillArray(this.state.buttons.filter(a => a.isActive === true).map(a => a.name));
    }

    render() {
        return (
            <FormGroup>
                <ControlLabel>Filter by amount of climbing (in meters):</ControlLabel>
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