import React from 'react';
import renderer from 'react-test-renderer';

import JoinPartyName from '../JoinParty/JoinPartyName';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<JoinPartyName />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});