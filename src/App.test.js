import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')
  .mockImplementation(() => Promise.resolve({
      json: () => {},
  }));


  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
