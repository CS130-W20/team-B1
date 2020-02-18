import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/MainScreen.css';
import { Button } from 'reactstrap';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'  



const PartyJoined = () => {
  return (
  	<div className="PartyJoined">
		<div class="searchDiv">
	        <Form class="searchBar" >
	            <FormControl
	                type="text"
	                placeholder="Search"
	                className="mr-sm-2"/>
	        </Form>          
		</div>

		<div class="title">
			<h1>Song Queue </h1>
		</div>




	    <div className="listViewSongQueue">
			<div class="list-group">
				<a href="#" class="list-group-item list-group-item-action listQueue">
					<div class="column left">
						<img class="albumArtwork" src="https://www.w3schools.com/images/w3schools_green.jpg" alt="W3Schools.com" />
					</div>

					<div class="column middle">Name of Song</div>

					<div class="column right buttonCard">
						<Button className="SkipButton" color="danger">Skip</Button>
					</div>
				</a>

			</div>
	  	</div>









  	</div>

  );
}

export default PartyJoined;
