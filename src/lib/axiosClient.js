import axios from 'axios'
import { getItem } from './storage'

const axiosClient = axios.create()

// api cors is good for these three
// axiosClient.defaults.baseURL = 'https://api.procurementsciences.com';
// axiosClient.defaults.baseURL = "https://psci-api.herokuapp.com";
// axiosClient.defaults.baseURL = 'http://localhost:3000';

axiosClient.defaults.baseURL = VITE_API_URL

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

// * Anywhere global headers are set with contentType(), make sure they're set back to default.
const resetDefault = () => {
  axiosClient.defaults.headers['Content-Type'] = 'application/json'
}

axiosClient.defaults.withCredentials = true

const api = {
  get(URL, customHeaders = {}) {
    const headers = { ...axiosClient.defaults.headers, ...customHeaders }
    return axiosClient
      .get(`/${URL}`, null, { headers })
      .then((response) => response.data)
  },
  post(URL, payload, customHeaders = {}) {
    const headers = { ...axiosClient.defaults.headers, ...customHeaders }
    resetDefault()
    return axiosClient
      .post(`/${URL}`, payload, { headers })
      .then((response) => response.data)
  },
  put(URL, payload, customHeaders = {}) {
    const headers = { ...axiosClient.defaults.headers, ...customHeaders }
    resetDefault()
    return axiosClient
      .put(`/${URL}`, payload, { headers })
      .then((response) => response.data)
  },
  delete(URL, payload, customHeaders = {}) {
    const headers = { ...axiosClient.defaults.headers, ...customHeaders }
    return axiosClient
      .delete(`/${URL}`, payload, { headers })
      .then((response) => response.data)
  },
}

// An additional header "x-api-key" is provided at login.
// Append it to header defaults using the value provided
// at login and send with every subsequent request.
export function setupRequestHeaders() {
  axiosClient.defaults.headers['x-api-key'] = getItem('apiKey')
  axiosClient.defaults.headers['authorization'] = getItem('actok')
    ? `Bearer ${getItem('actok')}`
    : undefined
}

export function contentType(type) {
  axiosClient.defaults.headers['Content-Type'] = type
}

export default api
