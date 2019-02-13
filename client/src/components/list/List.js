import React, { Component } from 'react';
import { handleResponse } from '../../helpers';
import { API_URL } from '../../config';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';

class List extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      users: [],
      error: null,
      totalPages: 0,
      page: 1
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    const { page } = this.state;
    const firstIndex = page * 10 - 10;
    const lastIndex = page * 10;
    
    this.setState({ loading: true });
    fetch(`${API_URL}/users`)
    .then(handleResponse)
    .then((data) => {
      const { users } = data;
      const userRange = users.slice(firstIndex, lastIndex);
      const totalPages = Math.ceil(users.length/10);
      this.setState({ users: userRange, totalPages, loading: false });
    })
    .catch((error) => {
      this.setState({ error: error.errorMessage, loading: false });
    });
  }

  handlePaginationClick = (direction) => {
    let nextPage = this.state.page;

    nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;
    this.setState({ page: nextPage }, () => {
      this.fetchUsers();
    });
  }

  render() {
    const { loading, error, users, page, totalPages } = this.state;

    if (loading) {
      return (
        <div className="loading-container">
          <Loading />
        </div>
      )
    }

    if (error) {
      return <div className="error">{this.state.error}</div>
    }

    return (
      <div>
        <Table
          users={users}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          handlePaginationClick={this.handlePaginationClick}
          fetchCurrencies={this.fetchUsers}
        />
      </div>
    )
  }

}

export default List;
