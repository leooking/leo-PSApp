import { getItem } from './storage'
import api from './axiosClient'
import user from './user'
import router from '../router'
import saveLastPage from './saveLastPage'

// 14 min by default
const REFRESH_INTERVAL = 14 * 60 * 1000

let interval
export function setUpRefreshToken() {
  // replace without !interval for maintenance mode
  // if (user.signedIn) {
  if (user.signedIn && !interval) {
    // uncomment for maintenance mode
    // user.signOut()
    // router.push('/')

    // run immediate refresh if issued_at actok is more than 5min
    // this means user have refreshed the page before getting to wait for the refresh token cycle
    // for simpler implementation we will do an immediate refresh_token and then start the 15min cycle
    if (+new Date() - +new Date(user.issuedAt) >= REFRESH_INTERVAL) {
      refreshActok()
    }
    interval = setInterval(refreshActok, REFRESH_INTERVAL)
  }
}

export async function refreshActok() {
  if (!user.signedIn && interval) {
    clearInterval(interval)
    interval = null
    return
  }
  const requestBody = `grant_type=refresh_token&refresh_token=${getItem(
    'retok'
  )}`
  try {
    const res = await api.post('session/token_refresh', requestBody, {
      'content-type': 'application/x-www-form-urlencoded',
    })
    user.refresh(res)
  } catch (e) {
    // check if access token is still valid
    const token = getItem('actok')
    if (token) {
      const timeLeft =
        JSON.parse(atob(token?.split('.')[1]))?.exp * 1000 - +new Date()

      if (timeLeft > 35000) {
        // set timeout to refresh token before a 30 seconds from expiration
        clearInterval(interval)
        interval = setInterval(refreshActok, timeLeft - 30000)
        return
      }
    }

    // saveLastPage()
    user.signOut()
    router.push('/session/email')
  }
}
