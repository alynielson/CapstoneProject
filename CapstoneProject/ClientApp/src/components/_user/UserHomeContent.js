import React, { Component } from 'react';
import image from './user_images/grey-race.jpg'

export class UserHomeContent extends Component {
    constructor(props) {
        super(props);

    }




    render() {
        const background = {
            height: "89vh",
            backgroundImage: `url(${image}`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
        }
        
        return (
            
            <div style={background}></div>
            
            
            );
    }



}