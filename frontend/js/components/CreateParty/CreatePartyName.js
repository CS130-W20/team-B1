import React from 'react';
import { Button } from 'reactstrap';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import '../css/SpotifyPlayer.css';

const CreatePartyName = (props) => {
	console.log(localStorage.getItem('token'))
  return (
  	<div className="CreatePartyName">
  	  <div class="title">
	    	<h1>Name your party, {props.location.state.user.name}!</h1>
  		</div>

  		<div class="enterName">
	    	<input type="text"  value= "Party Name"/>
  		</div>

    	<div className="buttons">
	    	<Button className="button" color="success" > Launch Party!
	    		<small> Lets get rockin' </small>
	    	</Button>
  		</div>
			<SpotifyWebPlayer
				autoPlay
				callback={() => {console.log("LOL")}}
				persistDeviceSelection
				play={false}
				showSaveIcon
				token={localStorage.getItem('token')}
				styles={{
					sliderColor: '#1cb954',
				}}
				uris={['spotify:track:15qYihuKGFtQPnjsUX3CQO', 'spotify:track:1CWSbYQIA0XW4AQXvR4OLf',]}
			/>
  	</div>

  );
}

export default CreatePartyName;
