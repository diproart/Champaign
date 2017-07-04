// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import WelcomeMember from './WelcomeMember';

const fn = jest.fn();

const member = {
  id: 1,
  name: 'Jane Roe',
  email: 'janeroe@example.com',
  registered: false,
  donorStatus: 'donor',
};

test('renders correctly when given a valid member', () => {
  const wrapper = shallow(<WelcomeMember member={member} resetMember={fn} />);
  expect(toJson(wrapper)).toMatchSnapshot('WelcomeMemberWithMember');
});

test('does not render if the member is null', () => {
  const wrapper = shallow(<WelcomeMember member={null} resetMember={fn} />);
  expect(toJson(wrapper)).toMatchSnapshot('WelcomeMemberWithoutMember');
  expect(wrapper.get(0)).toBeNull();
});
