import React from 'react';
import renderer from 'react-test-renderer';

import PartyJoined from './index';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<PartyJoined />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});