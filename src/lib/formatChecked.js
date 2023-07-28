const formatChecked = (keys, noFolders) => {
  // * Reformat from PrimeVue's object based format into a single array of strings (not including folder pids)
  let items
  if (noFolders)
    items = Object.entries(keys)
      .flat(Infinity)
      .filter((item) => typeof item !== 'object')
  else
    items = Object.entries(keys)
      .flat(Infinity)
      .filter((item) => isNaN(Number(item)))
      .filter((item) => typeof item !== 'object')

  console.log({ items, keys })
  return items
}

export default formatChecked
