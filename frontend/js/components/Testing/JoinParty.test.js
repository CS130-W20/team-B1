import React from 'react';
import renderer from 'react-test-renderer';

import JoinPartyName from '../JoinParty';

describe ('Testing JoinParty Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<JoinPartyName />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
