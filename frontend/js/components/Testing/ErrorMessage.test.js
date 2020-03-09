import React from 'react';
import renderer from 'react-test-renderer';

import ErrorMessage from '../ErrorMessage';

describe ('Testing ErrorMessage Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<ErrorMessage />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
