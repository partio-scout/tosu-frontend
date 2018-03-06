import React from 'react';
import { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Activity from './Activity';

describe('<Activity />', () => {
  let activityComponent;
  let emptyActivityComponent;

  const activities = [
    {
      id: 1,
      guid: 'abx'
    }
  ];

  const dataSource = [
    {
      guid: 'abx',
      title: 'Testi 1'
    }
  ];

  const muiTheme = getMuiTheme();

  beforeEach(() => {
    emptyActivityComponent = shallow(<Activity />);

    activityComponent = mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Activity eventActivities={activities} dataSource={dataSource} />
      </MuiThemeProvider>
    );
  });

  it('no activities given, say no activities', () => {
    expect(emptyActivityComponent.text()).toContain(
      'Ei aktiviteetteja valittuna'
    );
  });

  it('if activites are given, render component containing activityTitle ', () => {
    expect(activityComponent.find('.activityTitle').text()).toContain(
      'Testi 1'
    );
  });
});
