import mitt from 'mitt'
import { setupRequestHeaders } from './axiosClient'
import { setUpRefreshToken } from './refreshToken'
import { clearAllItems, getItem, setItem } from './storage'
import LogRocket from 'logrocket'

export const userEvent = mitt()

export default {
  profile: {},
  pid: null,
  notifications: {},
  email: null,
  email_verified: null,
  dashboard_home: true,
  generator_type: null,
  generator_pid: null,
  signedIn: false,
  issuedAt: null,
  admin: false,

  setup(user = getItem('currentUser')) {
    if (!user) {
      this.signOut()
    }
    this.setProps(user)
    if (user?.pid) {
      LogRocket.identify(user.pid, {
        name: user.profile.fname + ' ' + user.profile.lname,
        email: user.email,
      })
      window.Intercom('boot', {
        app_id: 'u7bqjwmu',
        ...user,
      })
    }
    setupRequestHeaders()
    setUpRefreshToken()
  },
  signIn(user) {
    setItem('actok', user.actok)
    setItem('retok', user.retok)
    delete user.actok
    delete user.retok
    setItem('currentUser', user)
    this.setup()
    userEvent.emit('signIn', this)
  },
  signOut() {
    this.profile = {}
    this.email = null
    this.signedIn = false
    userEvent.emit('signOut', this)
    clearAllItems()
  },
  setProps(user = {}) {
    this.pid = user?.pid
    this.email = user?.email
    this.notification = user?.notification
    this.email_verified = user?.email_verified
    this.profile = user?.profile ?? {}
    this.dashboard_home = user?.dashboard_home
    this.generator_type = user?.generator_type
    this.generator_pid = user?.generator_pid
    this.signedIn = !!getItem('actok')
    this.issuedAt = user?.issued_at
    this.org = user?.profile?.org
    this.admin = user?.admin
  },
  refresh(token) {
    if (!token) return
    const user = getItem('currentUser')
    user.issuedAt = token.issued_at
    setItem('actok', token.actok)
    setItem('currentUser', user)
    this.setProps(user)
    setupRequestHeaders()
  },
}
