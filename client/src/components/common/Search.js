import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../../helpers';
import Loading from './Loading';
import './Search.css';

class Search extends Component {
  constructor() {
    super();

    this.state = {
      searchResults: [],
      searchQuery: '',
      loading: false
    }
  }

  handleChange = (e) => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery });

    if (!searchQuery) {
      return '';
    }

    this.setState({ loading: true });

    fetch(`${API_URL}/users/autocomplete?searchQuery=${searchQuery}`)
      .then(handleResponse)
      .then(result => {
        this.setState({
          loading: false,
          searchResults: result.users
        });
      });
  }

  handleRedirect = (username) => {
    // Clear input value and close autocomplete container
    this.setState({
      searchQuery: '',
      searchResults: ''
    });

    this.props.history.push(`/user/${username}`);
  }

  renderSearchResults = () => {
    const { searchResults, searchQuery, loading } = this.state;

    if (!searchQuery) {
      return '';
    }

    if (searchResults.length > 0 ) {
      return (
        <div className="Search-result-container">
          {searchResults.map(result => (
            <div
              key={result.id}
              className="Search-result"
              onClick={() => this.handleRedirect(result.username)}
            >
              {result.name}
            </div>
          ))}
        </div>
      );
    }

    if (!loading) {
      return (
        <div className="Search-result-container">
          <div className="Search-no-result">
            No results found.
          </div>
        </div>
      );
    }
  }

  render() {
    const { loading, searchQuery } = this.state;

    return (
      <div className="Search">
        <span className="Search-icon">
          <i className="fa fa-search"></i>
        </span>

        <input
          className="Search-input"
          placeholder="Search users"
          type="text"
          onChange={(e) => this.handleChange(e)}
          value={searchQuery}
        />

        {loading &&
          <div className="Search-loading">
            <Loading
              width="12px"
              height="12px"
            />
          </div>}

        {this.renderSearchResults()}
      </div>
    )
  }
}

export default withRouter(Search);
