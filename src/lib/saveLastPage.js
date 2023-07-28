const saveLastPage = () => {
  if (
    !window.location.pathname.includes('session') &&
    window.location.pathname !== '/'
  ) {
    console.log(window.location.pathname !== '/', 'saved')
    localStorage.setItem('lastPage', window.location.pathname)
  }
}

export default saveLastPage
