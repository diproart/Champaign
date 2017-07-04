// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ShowIf from './ShowIf';

test('renders correctly', () => {
  const wrapper = shallow(<ShowIf condition={true}>Content</ShowIf>);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('renders null if passed with no children', () => {
  const wrapper = shallow(<ShowIf condition={true} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('it has visible class when condition is truthy', () => {
  const wrapper = shallow(<ShowIf condition={true}>Hello</ShowIf>);
  expect(wrapper.hasClass('ShowIf--visible')).toBeTruthy();
});

test('it has hidden class when condition is falsy', () => {
  const wrapper = shallow(<ShowIf condition={false}>Hello</ShowIf>);
  expect(wrapper.hasClass('ShowIf--hidden')).toBeTruthy();
});
