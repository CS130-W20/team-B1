import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

const ErrorMessage = (props) => {

  const header = props.header ? props.header : ':(';
  const message = props.message ? props.message : 'Something went wrong! Are you sure you\'re in the right place?';
  const headerSize = props.headerSize ? props.headerSize : '15em';
  const messageSize = props.messageSize ? props.messageSize : '2.5em';
  return(
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="2" />
        <Col md="auto">
            <h1 style={{fontSize: headerSize}}>{header}</h1>
            <p style={{fontSize: messageSize}}>
              {message}
            </p>
        </Col>
        <Col xs lg="2" />
      </Row>
    </Container>
  );
};

export default ErrorMessage;
