const handleSearch = (data, type, sort) => {
  let temp = data
  if (sort === 'asc')
    temp.sort((a, b) => {
      if (a[type] && b[type]) {
        if (type !== 'start_date' || 'deadline' || 'icon' || 'created_at')
          return a[type].localeCompare(b[type])
        else return new Date(a[type]) < new Date(b[type])
      }
    })
  else
    temp.sort((a, b) => {
      if (a[type] && b[type]) {
        if (type !== 'start_date' || 'deadline' || 'icon' || 'created_at')
          return b[type].localeCompare(a[type])
        else return new Date(a[type]) > new Date(b[type])
      }
    })
  console.log(data, temp, '___')
  data = temp
}

export default handleSearch
