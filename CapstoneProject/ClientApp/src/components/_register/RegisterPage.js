import React, { Component } from 'react';

export class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            location: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkIfPasswordMatch = this.checkIfPasswordMatch.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        console.log(`Submitted: ${this.state.first_name} ${this.state.last_name} ${this.state.email} ${this.state.password} ${this.state.location}`);
        event.preventDefault();
    }

    checkIfPasswordMatch(event) {
        
        
        if (this.state.password !== this.state.password_confirmation) {
            console.log("Passwords don't match");
        }
    }

   
    render() {
        return (
            <div>
            <h1> Register </h1>
            <div className="row">
                <div className="col-md-4">
                    <form>
                        <label>First Name</label>
                        <input 
                                type="text"
                                name="first_name"
                                value={this.state.first_name}
                                onChange={this.handleChange}
                        />
                        <br />
                        <label>Last Name</label>
                        <input 
                                type="text"
                                name="last_name"
                                value={this.state.last_name}
                                onChange={this.handleChange}
                        />
                        <br />
                        <label>Email Address</label>
                        <input 
                                type="text"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                    
                        />
                        <br />
                        <label>Password</label>
                        <input 
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        <label>Confirm Password</label>
                        <input
                                type="password"
                                name="password_confirmation"
                                value={this.state.password_confirmation}
                                onChange={this.handleChange}
                                onBlur={this.checkIfPasswordMatch}
                        />
                        <br />
                        <label>Location</label>
                        <input 
                                type="text"
                                name="location"
                                value={this.state.location}
                                onChange={this.handleChange}
                            //onfocusout={(event, newValue) => this.setState({ location: newValue })}
                        />
                        <br />
                        <button label="Submit" onClick={(event) => this.handleSubmit(event)} />
                    </form>
                </div>
            </div>
        </div>
        );
    }
}
