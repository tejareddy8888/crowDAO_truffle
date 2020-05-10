
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

const reducer = (history) => combineReducers({
  router: connectRouter(history)
  //... // rest of your reducers
})
export default reducer

// import { combineReducers } from 'redux'
// import { routerReducer } from 'react-router-redux'

// const reducer = combineReducers({
//   routing: routerReducer
// })

// export default reducer

// // reducers.js