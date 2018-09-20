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
            location: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
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
        event.preventDefault();
        
    }

    validatePassword() {
        return this.state.password.split('').length >= 10 || this.state.password === '';
    }

    confirmPasswordsMatch() {
        return this.state.password_confirmation === '' || this.state.password === this.state.password_confirmation;
    }

    validateEmail() {
        return this.state.email === '' || (this.state.email.split('').includes("@") && this.state.email.split('').includes("."));
    }

    checkIfCanSubmit() {
        return this.state.email.split('').includes("@")
            && this.state.email.split('').includes(".")
            && this.state.first_name !== ''
            && this.state.last_name !== ''
            && this.state.location !== ''
            && this.state.password !== ''
            && this.state.password_confirmation === this.state.password;
    }

   
    render() {
        return (
            <div>
            <h1> Register </h1>
            <div className="row">
                <div className="col-md-4">
                        <form>
                        <div className="form-group">
                        <label>First Name</label>
                        <input 
                                type="text"
                                name="first_name"
                                value={this.state.first_name}
                                onChange={this.handleChange}
                                />
                                </div>
                       <div className="form-group">
                        <label>Last Name</label>
                        <input 
                                type="text"
                                name="last_name"
                                value={this.state.last_name}
                                onChange={this.handleChange}
                        />
                            </div>
                            <div className="form-group">
                        <label>Email Address</label>
                        <input 
                                type="text"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}/>
                            <small hidden={this.validateEmail()}className="form-text text-muted">Not a valid email</small>

                        
                            </div>
                            <div className="form-group">
                        <label>Password</label>
                        <input 
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    
                                />
                                <small hidden={this.validatePassword()}className="form-text text-muted">Password not long enough</small>
                            </div>
                            <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                                type="password"
                                name="password_confirmation"
                                value={this.state.password_confirmation}
                                onChange={this.handleChange}
                                
                                />
                                <small hidden={this.confirmPasswordsMatch()}className="form-text text-muted">Passwords do not match</small>

                            </div>
                            <div className="form-group">
                        <label>Location</label>
                        <input 
                                type="text"
                                name="location"
                                value={this.state.location}
                                onChange={this.handleChange}
                        />
                            </div>
                             
                            
                            <button label="Submit" disabled={!this.checkIfCanSubmit()}className="btn btn-primary" onClick={(event) => this.handleSubmit(event)} />
                           
                            
                            
                    </form>
                </div>
            </div>
        </div>
        );
    }
}
