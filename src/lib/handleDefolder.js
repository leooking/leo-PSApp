import api from './axiosClient'
import toast from './toast'

const handleDefolder = async (item, name) => {
  try {
    console.log(item, name)
    let plural
    if (name === 'asset') plural = 'assetz'
    else plural = name + 's'

    const res = await api.post(`${plural}/${item.pid}/unfolder`, {
      source_folder_pid: item.folder.pid,
    })
    toast.success('Detached Folder')
  } catch (err) {
    throw new Error(err)
  }
}

export default handleDefolder
