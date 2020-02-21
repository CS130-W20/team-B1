import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom'
import qs from 'qs';

import Loading from '../Loading';

import { loginToDirector } from '../../utils/api';

class OAuthCallback extends Component {

  constructor() {
    super();
    this.state = {
			loading: true,
			user: null,
		};
  }

  componentDidMount() {
    const foundCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).code;
    loginToDirector({'code': foundCode}).then(json => { 
      localStorage.setItem('token', json.token);
      this.setState({loading: false, user: json['user']});
    });
  }
  
  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return <Redirect to={{
        pathname: '/host',
        state: { user: this.state.user }
      }} />;
    }
  }

};

export default OAuthCallback;
