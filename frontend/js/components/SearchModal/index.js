import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Form, FormControl, Modal } from 'react-bootstrap'  

import { searchSpotify } from '../../utils/api';

import '../css/SearchModal.css';

class SearchModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
      error: null,
      searchString: '',
      searchResults: null,
    }
	}

	handleFormChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
		});
	}

	handleFormSubmit(event) {
		event.preventDefault();
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.handleSearch();
    }
  }
  
  handleSearch() {
    searchSpotify({'query': this.state.searchString, 'token': localStorage.getItem('token')})
    .then(json => {
      if (json.hasOwnProperty('token')) {
        localStorage.setItem('token', json.token);
      }
      return this.setState({searchResults: json.songs, error: null});
    })
    .catch(error => this.setState({error: error.message}));
  }

  handleSongAdd(result) {
    console.log(`${result.song_name} should be added!`)
  }

	render() {
  	return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search for a Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="searchDiv">
            <Form className="searchBar" onSubmit={this.handleFormSubmit}>
              <FormControl
                type="text"
                placeholder="Stairway to Heaven"
                name="searchString"
                className="mr-sm-2"
                onChange={this.handleFormChange.bind(this)} 
                onKeyPress={this.handleKeyPress.bind(this)}
              />
            </Form>          
          </div>
				  {this.state.error ? <small className="error">{this.state.error}</small> : null}
          {this.state.searchResults ?
          <div className="searchResults">
            <div className="list-group">
              {this.state.searchResults.map((result, index) => (
                <div key={index} className="list-group-item list-group-item-action searchResult">
                  <a href={result.url} target="_blank">
                    <div className="column left">
                      <img className="albumArtwork" src={result.album_art} alt={`${result.song_name} Album Art`} />
                    </div>
                    <div className="column middle songTitle">{result.song_name}</div>
                    <div className="column middle songArtist">{result.artist_name}</div>
                  </a>
                  <div className="column right buttonCard">
                    <Button className="AddButton" color="success" onClick={() => this.handleSongAdd(result)}>Add</Button>
                  </div>
                </div>
              ))}
            </div>
				  </div>
          :
          null
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="center" onClick={this.handleSearch.bind(this)}>
            SEARCH
          </Button>
        </Modal.Footer>
      </Modal>
		);
	}
}

export default SearchModal;
