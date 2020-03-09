import React from 'react';
import renderer from 'react-test-renderer';

import Loading from '../Loading';

describe ('Testing Loading Page', () => {
    it('correctly renders', () => {
        const wrapper = renderer.create(<Loading />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
