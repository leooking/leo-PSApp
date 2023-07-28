const formatResponse = (asset) => {
  asset.interactions.forEach((inter) => {
    // inter.response = inter?.response?.replaceAll('\n', '<br />')
  })
  return asset
}

export default formatResponse
