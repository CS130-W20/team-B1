import React from 'react';
import renderer from 'react-test-renderer';

import Loading from '../MainScreen/index';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<Loading />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});