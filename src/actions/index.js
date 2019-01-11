import * as types from '../constants/ActionTypes'
import * as sources from '../constants/DataSources'
import fetch from 'isomorphic-unfetch'
import moment from 'moment'
import LRUCache from 'lru-cache';
import { getCurrentYear } from '../selectors/CommonPageSelectors'
import { isProd, isServer, canUseIDB } from '../utils'

import db, {
  addEvents,
} from '../database/db'

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

// Snackbars
export const openSnackbar = (value) => ({
  type: types.OPEN_SNACKBAR,
  value,
})

export const closeSnackbar = () => ({
  type: types.CLOSE_SNACKBAR,
})

// API Calls
const BASE_URL = (isProd && isServer) ? 'https://tbatv-prod-hrd.appspot.com' : 'https://www.thebluealliance.com';
const TBA_KEY = '61bdelekzYp5TY5MueT8OokJsgT1ewwLjywZnTKCAYPCLDeoNnURu1O61DeNy8z3'; // TEMP: TODO replace key eventually
const FALLBACK_YEAR = moment().year();

const APICache = new LRUCache({
  max: 50, // Limit number of items
});
const handleErrors = (response) => {
  if (response.status === 304) {
    return undefined
  }

  if (!response.ok) {
    throw Error(response.statusText)
  }

  if (canUseIDB) {
    const lastModified = response.headers.get('last-modified')
    const lastModifiedTime = moment(lastModified).unix()
    db.apiCalls.put({
      url: response.url.replace(BASE_URL, ''),
      accessTime: moment().unix(),
      lastModified: lastModified ? lastModified : null,
      lastModifiedTime: lastModifiedTime ? lastModifiedTime : null,
    })
  }

  const responsePromise = response.json();
  // Manage cache on server
  responsePromise.then(json =>{
    const cacheControl = response.headers.get('cache-control').toLowerCase()
    if (isServer && cacheControl && cacheControl.includes('public')) {
      const maxAge = cacheControl.match(/max-age=(\d+)/)[1];
      if (maxAge) {
        APICache.set(response.url, json, parseInt(maxAge, 10)*1000)
      }
    }
  });
  return responsePromise
}

const createFetcher = ({
  dispatch,
  state,
  endpointUrl,
  fetchOptions, // Optional
  fastQuery, // Optional
  query,
  join, // Optional
  isCollection,
  transformData, // Optional
  createAction,
  writeDB,
}) => {
  let dataSource = sources.DEFAULT

  // Update from IndexedDB
  if (canUseIDB && state.getIn(['appState', 'idbEnabled'])) {
    if (fastQuery) {
      const fullQueryFast = join ? fastQuery.toArray().then(join) : fastQuery.toArray()
      Promise.all([fullQueryFast, db.apiCalls.get(endpointUrl)]).then(values => {
        const [data, apiCall] = values
        // If isCollection, make sure we've hit this endpoint before
        if ((!isCollection || apiCall) && dataSource < sources.IDB_FAST && data !== undefined) {
          dataSource = sources.IDB_FAST
          dispatch(createAction(isCollection ? data : data[0]))
        }
      }).catch(error => {
        console.log(error)
      })
    }

    const fullQuery = join ? query.toArray().then(join) : query.toArray()
    Promise.all([fullQuery, db.apiCalls.get(endpointUrl)]).then(values => {
      const [data, apiCall] = values
      // If isCollection, make sure we've hit this endpoint before
      if ((!isCollection || apiCall) && dataSource < sources.IDB && data.length > 0) {
        dataSource = sources.IDB
        dispatch(createAction(isCollection ? data : data[0]))
      }
    }).catch(error => {
      console.log(error)
    })
  }

  // Update from API
  if (state.getIn(['appState', 'apiEnabled'])) {
    dispatch(incrementLoadingCount())

    let apiCallPromise = new Promise(resolve => resolve())
    if (canUseIDB) {
      apiCallPromise = db.apiCalls.get(endpointUrl)
    }

    const url = BASE_URL + endpointUrl
    const cachedAPIResponse = APICache.get(url)
    let dataPromise
    if (isServer && cachedAPIResponse) {
      dataPromise = new Promise(resolve => resolve(cachedAPIResponse));
    } else {
      dataPromise = apiCallPromise.then(apiCall => {
        return fetch(
          url,
          fetchOptions ? fetchOptions : {headers: {
            'X-TBA-Auth-Key': TBA_KEY,
            'If-Modified-Since': apiCall ? apiCall.lastModified : null,
          }},
        )
        .then(handleErrors)
      });
    }

    return dataPromise.then(data => {
      if (dataSource < sources.API && data !== undefined) {
        dataSource = sources.API
        if (transformData) {
          data = transformData(data)
        }
        dispatch(createAction(data))

        // Delete old db entries and write new ones
        if (canUseIDB) {
          query.delete()
          writeDB(data)
        }
      }
      dispatch(decrementLoadingCount())
    })
    .catch(error => {
      dispatch(decrementLoadingCount())
      console.log(error)
    });
  }
}

// Top-level
export function fetchAPIStatus() {
  return (dispatch, getState) => {
    return createFetcher({
      dispatch,
      state: getState(),
      endpointUrl: `/api/v3/status`,
      query: db.config.where('key').equals('API_STATUS'),
      transformData: (status) => {
        status.key = 'API_STATUS'
        return status
      },
      createAction: (status) => {
        return {
          type: types.RECEIVE_API_STATUS,
          data: status,
        }
      },
      writeDB: (status) => {
        db.config.put(status)
      },
    })
  }
}

// EventListPage
export function fetchYearEvents(year) {
  return (dispatch, getState) => {
    const state = getState()
    year = parseInt(year, 10) || getCurrentYear(state) || FALLBACK_YEAR;
    return createFetcher({
      dispatch,
      state,
      endpointUrl: `/api/v3/events/${year}`,
      query: db.events.where('year').equals(year),
      isCollection: true,
      createAction: (events) => {
        return {
          type: types.RECEIVE_YEAR_EVENTS,
          year,
          data: events,
        }
      },
      writeDB: (events) => {
        addEvents(events)
      },
    })
  }
}
