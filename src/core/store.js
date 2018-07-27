/* global window */
import config from 'config';
import { applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';

/*
 * Enhance a redux store with common middleware.
 *
 * This returns a function that takes a single argument, `createStore`,
 * and returns a new `createStore` function.
 */
export function middleware({
  _config = config,
  _createLogger = createLogger,
  _window = typeof window !== 'undefined' ? window : null,
  routerMiddleware = null,
  sagaMiddleware = null,
} = {}) {
  const isDev = _config.get('isDevelopment');

  const callbacks = [];
  if (isDev && !_config.get('server')) {
    // Log all Redux actions but only when in development
    // and only on the client side.
    callbacks.push(_createLogger());
  }
  if (sagaMiddleware) {
    callbacks.push(sagaMiddleware);
  }
  if (routerMiddleware) {
    callbacks.push(routerMiddleware);
  }

  return compose(
    applyMiddleware(...callbacks),
    _config.get('enableDevTools') &&
    _window &&
    _window.__REDUX_DEVTOOLS_EXTENSION__
      ? _window.__REDUX_DEVTOOLS_EXTENSION__()
      : (createStore) => createStore,
  );
}
