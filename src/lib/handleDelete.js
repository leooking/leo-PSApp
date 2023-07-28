import toast from './toast'
import api from './axiosClient'
import capitalize from './capitalize'

const handleDelete = async (item, name) => {
  console.log({ item, name })
  let plural
  if (name === 'asset') plural = 'assetz'
  else plural = name + 's'

  if (item.folder_type) {
    await api.delete('folders/' + item.pid)
    toast.success(`${capitalize(name)} deleted`)
  } else {
    await api.delete(`${plural}/` + item.pid)
    toast.success(`${capitalize(name)} deleted`)
  }
}

export default handleDelete
