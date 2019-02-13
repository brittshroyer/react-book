import React, { Component } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { handleResponse } from '../helpers';
import Text from './forms/Text';
import Photo from './photo/Photo';
import './Create.css';
import { FormGroup, ControlLabel, Radio, Button } from 'react-bootstrap';

class Create extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      username: '',
      usernameValidated: null,
      name: '',
      occupation: '',
      hometown: '',
      gender: '',
      photo: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlenameChange = this.handlenameChange.bind(this);
    this.handleOccupationChange = this.handleOccupationChange.bind(this);
    this.handleHometownChange = this.handleHometownChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
  }

  validateUsername() {
    const { username } = this.state;
    const length = username.length;
    let usernameExists = false;

      fetch(`${API_URL}/users/validateUsername?searchQuery=${username}`)
        .then(handleResponse)
        .then(result => {
          // if username not found
          if (result.result !== null) {
            usernameExists = true;
          }
          if (length > 3 && !usernameExists) {
            this.setState({ usernameValidated: 'success' });
          } else if (length > 0 || usernameExists) {
            this.setState({ usernameValidated: 'error' });
          } else {
            this.setState({ usernameValidated: null });
          }
        });
  }

  handleUsernameChange(e) {
    const username = e.target.value.trim();

    this.setState({ username }, () => {
      this.validateUsername();
    });
  }

  handlenameChange(e) {
    const name = e.target.value;

    this.setState({ name });
  }

  handleOccupationChange(e) {
    const occupation = e.target.value;

    this.setState({ occupation });
  }

  handleHometownChange(e) {
    const hometown = e.target.value;

    this.setState({ hometown });
  }

  handleRadioChange(e) {
    this.setState({ gender: e.target.value });
  }

  submitProfile() {
    axios({
      method: 'post',
      url: `${API_URL}/users/create`,
      data: { model: this.state }
    }).then(res => {
      const { user } = res.data;
      this.handleRedirect(user.username);
    }).catch(err => {
      console.error('err creating profile', err);
    });
  }

  handleRedirect = (username) => {
    this.setState({
      username: '',
      usernameValidated: null,
      name: '',
      occupation: '',
      hometown: '',
      gender: '',
      photo: ''
    });

    if (!username) {
      this.props.history.push(`/`);
    } else {

      this.props.history.push(`/user/${username}`);
    }
  }

  setUserPhoto(photo) {
    this.setState({ photo });
  }

  render() {
    const { usernameValidated, name, occupation, hometown, gender } = this.state;
    let incompleteProfile;

    if (usernameValidated && name && occupation && hometown && gender ) {
      incompleteProfile = false;
    } else {
      incompleteProfile = true;
    }

    return (
      <div className="Detail">
        <div className="Detail-header">
          <h1>Create Profile</h1>
        </div>
        <div className="Detail-container create">


          <div className="row">
            <div className="col-sm-5">
              <Photo setUserPhoto={this.setUserPhoto.bind(this)} photo={this.state.photo} />
            </div>


            <div className="col-sm-7">
              <form>

                <Text
                  label="Username"
                  validationState={this.state.usernameValidated}
                  placeholder="Enter username"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                  subtext="Must be at least 4 characters"
                  editable={false}
                />

                <Text
                  label="Full Name"
                  placeholder="Enter name"
                  value={this.state.name}
                  onChange={this.handlenameChange}
                />

                <Text
                  label="Occupation"
                  placeholder="Enter occupation"
                  value={this.state.occupation}
                  onChange={this.handleOccupationChange}
                />

                <Text
                  label="Hometown"
                  placeholder="Enter hometown"
                  value={this.state.hometown}
                  onChange={this.handleHometownChange}
                />

                <FormGroup>
                  <ControlLabel>Gender</ControlLabel><br />
                  <Radio name="radioGroup" value="male" onChange={this.handleRadioChange} inline>
                    Male
                  </Radio>{' '}
                  <Radio name="radioGroup" value="female" onChange={this.handleRadioChange} inline>
                    Female
                  </Radio>{' '}
                </FormGroup>

              </form>

            </div>
            <div className="col-sm-12 footer">
              <Button type="submit" className="btn btn-secondary" onClick={() => this.handleRedirect(null)}>Cancel</Button>
              <Button type="submit" className="btn btn-success" onClick={this.submitProfile} disabled={incompleteProfile}><i className="fa fa-paper-plane"></i>&nbsp;Submit</Button>
            </div>
          </div>

        </div>
      </div>

    );
  }
}

export default Create;
