import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './Table.css';

const Table = (props) => {
  const { users, history } = props;

  return (
    <div className="Table-container">
      <table className="Table">
        <thead className="Table-head">
          <tr>
            <th>User</th>
            <th>Gender</th>
            <th>Occupation</th>
            <th>Hometown</th>
          </tr>
        </thead>
        <tbody className="Table-body">
          {users.map((user, i) => (
            <tr
              key={user.username}
              onClick={() => history.push(`/user/${user.username}`)}
            >
              <td><span className="Table-rank">{i + 1}</span>{user.username}</td>
              <td><i className="fa fa-transgender"></i>&nbsp;&nbsp;{user.gender}</td>
              <td><i className="fa fa-briefcase"></i>&nbsp;&nbsp;{user.occupation}</td>
              <td><i className="fa fa-map-pin"></i>&nbsp;&nbsp;{user.hometown}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Table.propTypes = {
  users: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(Table);
