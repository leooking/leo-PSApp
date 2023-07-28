const formatName = (name) => {
  return name
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .split('.')[0]
    .toLowerCase()
    .replace(/\b[a-z](?=[a-z]{2})/g, (letter) => letter.toUpperCase())
}

export default formatName
