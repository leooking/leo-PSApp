const depthToColor = (depth) => {
  let res = 'border-l-2 pl-2 '

  if (depth === 0) res = ''
  else if (depth === 1) res += 'border-indigo-400'
  else if (depth === 2) res += 'border-orange-400'
  else if (depth === 3) res += 'border-green-400'
  else if (depth === 4) res += 'border-red-400'
  else if (depth === 5) res += 'border-yellow-400'
  else if (depth === 6) res += 'border-pink-400'
  else if (depth === 7) res += 'border-emerald-400'
  else if (depth === 8) res += 'border-blue-400'

  return res
}

export default depthToColor
