import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import qs from 'qs';

import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';

import { loginToDirector } from '../../utils/api';

class OAuthCallback extends Component {

  constructor() {
    super();
    this.state = {
			loading: true,
      user: null,
      abort: false,
      error: null,
		};
  }

  componentDidMount() {
    const foundCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).code;
    if (foundCode == null || foundCode == undefined) {
      this.setState({abort: true});
    }
    else {
      loginToDirector({'code': foundCode})
        .then(json => { 
          localStorage.setItem('token', json.token);
          localStorage.setItem('refresh_token', json.refresh_token);
          this.setState({loading: false, user: json['user']});
        })
        .catch(error => {
          this.setState({error: error});
        });
    }
  }

  componentDidUpdate() {
    if (this.state.error) {
      setTimeout(() => {
        this.props.history.push('/login');
      }, 4500);
    }
    else if (this.state.abort) {
      this.props.history.push('/login');
    }
  }
  
  render() {
    if (this.state.error) {
      return (
        <ErrorMessage 
          header={'Spotify Login failed!'}
          headerSize={'2em'}
          message={`${this.state.error}\nRedirecting you back to login...`}
          messageSize={'1em'}
        />
      );
    }
    else if (this.state.loading) {
      return <Loading />;
    }
    else {
      return <Redirect to={{
        pathname: '/host',
        state: { user: this.state.user, prevRoute: 'OAuthCallback' }
      }} />;
    }
  }

};

export default OAuthCallback;
