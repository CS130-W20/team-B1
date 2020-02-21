import React from 'react';
import renderer from 'react-test-renderer';

import MainScreen from './index';

describe ('Testing Spotify Login Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<MainScreen />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});