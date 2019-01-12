import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { StylesProvider } from '@material-ui/styles';
import MemoryRouter from 'react-router-dom/MemoryRouter';

import App from './App';
import createStore from './store/createStore';

describe('<App />', () => {
  it('renders without crashing', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock; // Set to mock function
    const { store } = createStore();
    ReactDOM.render(
      <Provider store={store}>
        <StylesProvider>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </StylesProvider>
      </Provider>,
      document.createElement('div')
    );
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });
});
