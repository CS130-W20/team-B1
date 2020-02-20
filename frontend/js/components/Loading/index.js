import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = () => (
  <React.Fragment>
    <Spinner animation="grow" variant="primary" style={{'animationDuration': '2.1s'}}/>
    <Spinner animation="grow" variant="secondary" style={{'animationDelay': '0.3s', 'animationDuration': '2.1s'}} />
    <Spinner animation="grow" variant="success" style={{'animationDelay': '0.6s', 'animationDuration': '2.1s'}} />
    <Spinner animation="grow" variant="danger" style={{'animationDelay': '0.9s', 'animationDuration': '2.1s'}} />
    <Spinner animation="grow" variant="warning" style={{'animationDelay': '1.2s', 'animationDuration': '2.1s'}} />
    <Spinner animation="grow" variant="info" style={{'animationDelay': '1.5s', 'animationDuration': '2.1s'}} />
  </React.Fragment>
);

export default Loading;
