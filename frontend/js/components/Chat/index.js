import React, {Component} from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { connect } from 'react-redux';
import { userActions } from '../../redux/actions/UsersActions';


class Chat extends Component {

  constructor() {
    super();
    this.state = {
      socketResponseHandlerAdded: false,
      unrepliedMessages: 0,
    };
  }

  componentDidMount() {
    this.props.getCurrent()
    if (this.props.socket && !this.state.socketResponseHandlerAdded) {
      this.props.socket.onMessage.addListener(data => this.handleResponseMessage(data))
      this.setState({socketResponseHandlerAdded: true})
    }
  }

  componentDidUpdate() {
    if (this.props.socket && !this.state.socketResponseHandlerAdded) {
      this.props.socket.onMessage.addListener(data => this.handleResponseMessage(data));
      this.setState({socketResponseHandlerAdded: true})
    }
  }

  handleResponseMessage = (data) => {
    let json = JSON.parse(data)
    if (json.command != 'chat') {
      return;
    }
    if (json.user == this.props.user.username) {
      return;
    }
    addResponseMessage(json.message);
    this.setState({unrepliedMessages: this.state.unrepliedMessages + 1})
  }
  
  handleNewUserMessage = (message) => {
    this.props.socket.sendRequest({
        'command': 'chat',
        'message': message
    }).then(() => {this.setState({unrepliedMessages: 0})});
  }

  render() {
    return (
      <Widget
        handleNewUserMessage={this.handleNewUserMessage}
        title={null}
        subtitle={null}
        addResponseMessage
        badge={this.state.unrepliedMessages}
      />
    );
  }
}

function mapStateToProps (state) {
  const user = state.user.currentUser;
  const socket = state.socket.socket;
  return { user, socket };
}

const actionCreators = {
  getCurrent: userActions.getCurrent,
}

export default connect(mapStateToProps, actionCreators)(Chat);
