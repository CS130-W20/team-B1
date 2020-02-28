import React from 'react';
import renderer from 'react-test-renderer';

import OAuthCallback from '../OAuthCallback/index';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<OAuthCallback />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});