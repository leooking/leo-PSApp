const formatInteractions = (interactions) => {
  let temp = ''
  interactions?.forEach((interaction) => {
    temp += interaction.response + '<br />'
  })
  return temp
}

export default formatInteractions
