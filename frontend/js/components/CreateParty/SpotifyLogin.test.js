import React from 'react';
import renderer from 'react-test-renderer';

import SpotifyLogin from './SpotifyLogin';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<SpotifyLogin />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
