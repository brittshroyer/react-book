import React, { Component } from 'react';
import Photo from '../photo/Photo';
import Loading from '../common/Loading';
import { API_URL } from '../../config';
import axios from 'axios';
import { handleResponse } from '../../helpers';
import Text from '../forms/Text';
import { FormGroup, ControlLabel, Button, Radio } from 'react-bootstrap';

import './Detail.css';

class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      name: '',
      occupation: '',
      hometown: '',
      gender: '',
      photo: '',
      loading: false,
      error: null,
      disabled: true,
      incompleteProfile: false
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;

    this.fetchUser(username);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const newUsername = nextProps.match.params.username;

      this.fetchUser(newUsername);
    }
  }

  fetchUser = (username) => {
    this.setState({ loading: true });

    fetch(`${API_URL}/users/${username}`)
      .then(handleResponse)
      .then(user => {
        const { username, name, occupation, hometown, gender, photo } = user;
        this.setState({ username, name, occupation, hometown, gender, photo, loading: false, error: null });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.error(error);
      });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleOccupationChange(e) {
    this.setState({ occupation: e.target.value });
  }

  handleHometownChange(e) {
    this.setState({ hometown: e.target.value });
  }

  editProfile() {
    this.setState({ disabled: false });
  }

  updateProfile() {
    let {incompleteProfile } = this.state;
    const { username, name, occupation, hometown, gender, photo } = this.state;
    const data = {
      name,
      occupation,
      hometown,
      gender,
      photo
    };

    if (name && occupation && hometown && gender) {
      incompleteProfile = false;
    } else {
      incompleteProfile = true;
    }

    if (incompleteProfile) {
      return;
    }

    axios({
      method: 'put',
      url: `${API_URL}/users/${username}`,
      data: { data }
    }).then(() => {
      this.setState({disabled: true});
    }).catch(err => {
      console.error('err creating profile', err);
    });
  }

  handleRadioChange(e) {
    this.setState({ gender: e.target.value });
  }

  setUserPhoto(photo) {
    const existingPhoto = this.state.photo;
    // If user has a photo, we need to delete the object from s3
    if (existingPhoto) {
      fetch(`${API_URL}/users/deletePhoto/?user=${this.state.username}`)
        .then(res => {
          console.log('res from delete call', res);
        });
    }

    this.setState({ photo });
  }

  render() {
    const { loading, error, username, name, occupation, hometown, gender } = this.state;
    let male, female;

    if (gender === 'male') {
      male = true;
    }

    if (gender === 'female') {
      female = true;
    }

    const genderForm = this.state.disabled ? (
      <div className="Detail-item">
        Gender <span className="Detail-value">{gender}</span>
      </div>
      ) : (
        <FormGroup>
          <ControlLabel>Gender</ControlLabel><br />
          <Radio name="radioGroup" value="male" onChange={this.handleRadioChange.bind(this)} checked={male} inline>
            Male
          </Radio>{' '}
          <Radio name="radioGroup" value="female" onChange={this.handleRadioChange.bind(this)} checked={female} inline>
            Female
          </Radio>{' '}
        </FormGroup>
      );

    if (loading) {
      return <div className="loading-container"><Loading /></div>
    }

    if (error) {
      return <div className="error">{error}</div>
    }

    return (
      <div className="Detail">
        <h1 className="Detail-heading">
          {username}
        </h1>
        <div className="Detail-container">
          <div className="row">
            <div className="col-sm-5">
              <Photo disabled={this.state.disabled} photo={this.state.photo} setUserPhoto={this.setUserPhoto.bind(this)}/>
            </div>
            <div className="col-sm-7">
              <form>

                <Text
                  label="Name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={this.handleNameChange.bind(this)}
                  disabled={this.state.disabled}
                />

                <Text
                  label="Occupation"
                  placeholder="Enter Occupation"
                  value={occupation}
                  onChange={this.handleOccupationChange.bind(this)}
                  disabled={this.state.disabled}
                />

                <Text
                  label="Hometown"
                  placeholder="Enter Hometown"
                  value={hometown}
                  onChange={this.handleHometownChange.bind(this)}
                  disabled={this.state.disabled}
                />

                {genderForm}

              </form>

            </div>
          </div>
          <div className="Detail-footer text-right">
            {
              this.state.disabled ? (
                <Button className="btn btn-primary" onClick={this.editProfile.bind(this)}><i className="fa fa-pencil"></i> &nbsp;Edit Profile</Button>
              ) : (
                <Button className="btn btn-success" onClick={this.updateProfile.bind(this)}>Save</Button>
              )
            }
          </div>

        </div>
      </div>
    )
  }
}

export default Detail;
