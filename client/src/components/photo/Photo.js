import React, { Component } from 'react';
import { API_URL } from '../../config';
import { handleResponse } from '../../helpers';
import Loading from '../common/Loading';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import './Photo.css';


class Photo extends Component {

  constructor() {
    super();

    this.state = { loading: false };
  }

  triggerSelect() {
    this.refs.fileInput.click();
  }

  onPhotoSelect(e) {
    const fileList = e.target.files;
    const photo = fileList[0];

    this.setState({loading: true});
    fetch(`${API_URL}/users/photo/?file_name=${photo.name}&file_type=${photo.type}`)
      .then(handleResponse)
      .then(res => {
        this.uploadToS3(photo, res.signed_request, res.url);
      }).catch(err => {
        this.setState({ photo: '' });
        console.error('error retrieving signed_request', err);
      });

  }

  uploadToS3(img, signed_request, url) {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.send(img);
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.props.setUserPhoto(url);
        this.setState({ loading: false });
      }
    };
    xhr.onerror = (err) => {
      console.error('err uploading to S3', err);
      this.setState({ loading: false });
    };
  }

  render() {
    // const { photo } = this.state;
    const { disabled, photo } = this.props;
    const uploadButton = disabled ? null : <Button type="submit" className="btn btn-primary photo-upload-btn" onClick={this.triggerSelect.bind(this)}><i className="fa fa-upload"></i> Upload Photo</Button>;
    let photoElement;

    if (photo === 'loading') {
      photoElement = <div className="loading-container"><Loading /></div>;
    } else if (!photo) {
      photoElement = <div><i className="fa fa-user-circle fa-5x"></i></div>;
    } else {
      photoElement = <img src={photo} alt="profile"/>;
    }

    return (
      <div>
        <div className="row">
          <FormGroup>
            <ControlLabel className="photo-label">Photo</ControlLabel><br />
            <div className="profile-picture-container text-center">
              {photoElement}
            </div>
            <input type="file" className="form-control-file d-none" accept="image/*" onChange={this.onPhotoSelect.bind(this)} ref="fileInput"></input>
          </FormGroup>
        </div>
        { }
        <div className="row text-center">
          {uploadButton}
        </div>
      </div>
    )
  }

}

export default Photo;
