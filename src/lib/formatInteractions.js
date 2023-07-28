export default (asset) => {
  // * Make sure newest are on top with correct count
  let temp = []
  asset.interactions.forEach((interaction, i) =>
    temp.push({ ...interaction, count: i + 1 })
  )
  asset.interactions = temp.reverse()
  return asset
}
