import * as types from '../constants/ActionTypes'
import { fromJS, OrderedSet, Map } from 'immutable';

const page = (state = Map({
  currentKey: '',
  historyOrder: OrderedSet(),  // Reverse ordered LRU keys
  stateHistory: Map(),
  // currentModalKey: undefined,
  // stateHistoryModal: Map(),
}), action) => {
  let currentPageState = state.getIn(['stateHistory', action.pageKey])
  if (currentPageState === undefined) {
    currentPageState = Map()
  }
  // let currentModalState = state.getIn(['stateHistoryModal', action.pageKey])
  // if (currentModalState === undefined) {
  //   currentModalState = Map()
  // }

  switch (action.type) {
    case types.SET_PAGE_KEY:
      state = state.set('currentKey', action.pageKey)
      return state
    case types.RESET_PAGE:
      state = state.set('currentKey', action.pageKey)
      if (action.defaultState && state.getIn(['stateHistory', action.pageKey]) === undefined) {
        state = state.setIn(['stateHistory', action.pageKey], fromJS(action.defaultState))
      }
      state = state.set('historyOrder', state.get('historyOrder').delete(action.pageKey).add(action.pageKey))
      return state
    case types.SET_PAGE_STATE:
      return state.setIn(['stateHistory', action.pageKey],
        currentPageState.merge(action.pageState))
    // case types.RESET_MODAL:
    //   state = state.set('currentModalKey', action.pageKey)
    //   if (action.defaultState && state.getIn(['stateHistoryModal', action.pageKey]) === undefined) {
    //     state = state.setIn(['stateHistoryModal', action.pageKey], fromJS(action.defaultState))
    //   }
    //   state = state.set('historyOrder', state.get('historyOrder').delete(action.pageKey).add(action.pageKey))
    //   return state
    // case types.SET_MODAL_STATE:
    //   return state.setIn(['stateHistoryModal', action.pageKey],
    //     currentModalState.merge(action.modalState))
    default:
      return state
  }
}
export default page
