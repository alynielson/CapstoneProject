import React, { Component } from 'react';
import background from './images/background.jpg'


export class UserHomeContent extends Component {
    constructor(props) {
        super(props);

    }




    render() {
        return (
            
            <img className="background-img" src={background} />
            
            
            );
    }



}