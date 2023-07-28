import api from './axiosClient'
import toast from './toast'

const handleFolder = async (state, item, name, scope) => {
  let plural
  if (name === 'asset') plural = 'assetz'
  else plural = name + 's'

  let parent = item?.parent_pid ? item.parent_pid : item?.folder?.pid

  if (item?.folder_type) {
    if (state.folder) {
      const res = await api.post(`folders/${item.pid}/relocate_folder`, {
        source_folder_pid: parent,
        destination_folder_pid: state.folder.value,
      })
      toast.success('Moved folder')
    } else {
      const res = await api.put(`folders/${item.pid} `, {
        name: state.name,
        scope: state.scope ? state.scope : scope,
        folder_type: name,
      })
      toast.success('Updated folder')
    }
  } else {
    if (state.folder) {
      const res = await api.post(`${plural}/${item.pid}/relocate_object`, {
        destination_folder_pid: state.folder.value,
        source_folder_pid: parent,
      })
      toast.success('Moved to folder')
    } else {
      const res = await api.post(`${plural}/${item.pid}/create_new_location`, {
        destination_folder_name: state.name,
        scope: state.scope ? state.scope : scope,
        source_folder_pid: parent,
        parent_folder_pid: parent,
      })
      toast.success('Folder created')
    }
  }
}

export default handleFolder
