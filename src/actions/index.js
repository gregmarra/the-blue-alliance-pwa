import * as types from '../constants/ActionTypes'

// App Bar / Nav Drawer
export const incrementLoadingCount = () => ({
  type: types.INCREMENT_LOADING_COUNT,
})

export const decrementLoadingCount = () => ({
  type: types.DECREMENT_LOADING_COUNT,
})

export const toggleTheme = () => ({
  type: types.TOGGLE_THEME,
})

export const setNav = (value) => ({
  type: types.SET_NAV_VALUE,
  value,
})
