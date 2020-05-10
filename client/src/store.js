// import createHistory from 'history/createBrowserHistory';
// import { createStore, applyMiddleware, compose } from 'redux'
// import thunkMiddleware from 'redux-thunk'
// import { routerMiddleware } from 'react-router-redux'
// import reducer from './reducer'


import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'

export const history = createBrowserHistory()

const store = createStore(
  reducer(history), // root reducer with router state
  compose(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history), // for dispatching history actions
      // ... other middlewares ...
      )
    )
  )

export default store

// const browserHistory = createHistory();
// // Redux DevTools
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const routingMiddleware = routerMiddleware(browserHistory)

// const store = createStore(
//   reducer,
//   composeEnhancers(
//     applyMiddleware(
//       thunkMiddleware,
//       routingMiddleware(history)
//     )
//   )
// )

// // export default store

// import { createBrowserHistory } from 'history'
// import { applyMiddleware, compose, createStore } from 'redux'
// import { routerMiddleware } from 'connected-react-router'
// import thunkMiddleware from 'redux-thunk'
// import reducer from './reducers'

// export const history = createBrowserHistory()

// export default function configureStore(preloadedState) {
//   const store = createStore(
//     reducer(history), // root reducer with router state
//     preloadedState,
//     compose(
//       applyMiddleware(
//         routerMiddleware(history), // for dispatching history actions
//         // ... other middlewares ...
//       ),
//     ),
//   )

//   return store
// }
