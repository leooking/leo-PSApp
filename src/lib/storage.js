export const setItem = set
export const getItem = get
export const clearItem = clear
export const clearAllItems = clearAll

const ss = sessionStorage
const ls = localStorage

const ITEM_TYPE = {
  authToken: {
    store: ls,
    key: 'saAuthToken',
  },
  apiKey: {
    store: ls,
    key: 'saApiKey',
  },
  actok: {
    store: ls,
    key: 'saActok',
  },
  retok: {
    store: ls,
    key: 'saRetok',
  },
  currentUser: {
    store: ls,
    key: 'saUser',
  },
  auth0Actok: {
    store: ls,
    key: 'auth0Actok',
  },
  auth0Idtok: {
    store: ls,
    key: 'auth0Idtok',
  },
}

// (type: string) => string
function get(type) {
  if (!ITEM_TYPE[type]) return
  const { store, key } = ITEM_TYPE[type]
  return JSON.parse(store.getItem(key))
}

// (type: string, item: string) => void
function set(type, item) {
  if (!ITEM_TYPE[type]) return
  const { store, key } = ITEM_TYPE[type]
  store.setItem(key, JSON.stringify(item))
}

// (type: string) => void
function clear(type) {
  if (!ITEM_TYPE[type]) return
  const { store, key } = ITEM_TYPE[type]
  store.removeItem(key)
}

// () => void
function clearAll() {
  Object.keys(ITEM_TYPE).forEach((key) => clear(key))
}
