import React from 'react';
import renderer from 'react-test-renderer';

import JoinPartyList from './JoinPartyList';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<JoinPartyList />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});