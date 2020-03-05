import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

const FourOhFour = () => (
  <Container>
    <Row className="justify-content-md-center">
      <Col xs lg="2" />
      <Col md="auto">
          <h1 style={{fontSize: '15em'}}>:(</h1>
          <p style={{fontSize: '2.5em'}}>
            Something went wrong! Are you sure you're in the right place?
          </p>
      </Col>
      <Col xs lg="2" />
    </Row>
  </Container>
);

export default FourOhFour;
