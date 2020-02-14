import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/MainScreen.css';
import { Button } from 'reactstrap';


const SpotifyLogin = () => {
  return (
    <div className="SpotifyLogin">
    	<div className="buttons">
      	<Button className="button" color="success"> Login to Spotify
      		<small> You are the life of the party! </small>
      	</Button>
    	</div>
    </div>

  );
}

export default SpotifyLogin;
