import mitt from 'mitt'

const TIMEOUT = 6000

export const toastEvent = mitt()

export default {
  open(info) {
    toastEvent.emit('open', info)
  },
  close() {
    toastEvent.emit('close')
  },
  success(message = '') {
    this.open({
      title: 'Success',
      type: 'success',
      message,
    })
    setTimeout(this.close, TIMEOUT)
  },
  error(message = '') {
    this.open({
      title: 'Error',
      type: 'error',
      message: message || 'Error occured, try again later!',
    })
    setTimeout(this.close, TIMEOUT)
  },
  warning(message = '') {
    this.open({
      title: 'Warning',
      type: 'warning',
      message,
    })
    setTimeout(this.close, TIMEOUT)
  },
  info(message = '') {
    this.open({
      title: 'Information',
      type: 'info',
      message,
    })
    setTimeout(this.close, TIMEOUT)
  },
}
