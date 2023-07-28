import api from './axiosClient'
import toast from './toast'

export const formatData = (items, type, depth = 0) => {
  let rawItems = []
  let data = items.map((item, i) => {
    rawItems.push(item)
    if (item.children) items.push(...item.children)
    let parent_pid = item.pid

    const children = item.children?.map((child) => ({
      ...child,
      parent_pid,
    }))

    const typeItems = item[type] ? item[type] : []
    return {
      key: !!children ? i : item.pid, // * If folder use number, else use pid (for later filtering so we only send resources pids on selection)
      data: item,
      children: children
        ? formatData([...children, ...typeItems], type, depth + 1).data
        : [],
      // * Depth is used to signify color of children in table, so 0 is root level.
      depth,
    }
  })
  return {
    data,
    items: rawItems,
  }
}

const dataType = {
  projects: {
    private: 'private_orphan_projects',
    shared: 'shared_orphan_projects',
  },
  resources: {
    private: 'private_orphan_resources',
    shared: 'shared_orphan_resources',
  },
  assets: {
    private: 'private_orphan_assets',
    shared: 'shared_orphan_assets',
  },
}

const fetchFolders = async (url, type, scope) => {
  try {
    const data = await api.get(url)

    const shared_orphans = data[dataType[type].shared]
    const private_orphans = data[dataType[type].private]
    const shared_folders = data[`shared_folders`]
    const private_folders = data[`private_folders`]
    const available_source_tags = data.available_source_tags

    const privateFolders = private_folders
    const sharedFolders = shared_folders

    let baseData = {
      shared_orphans,
      private_orphans,
      shared_folders,
      private_folders,
    }
    // * Data specific to resources
    if (data?.shared_resources)
      baseData.shared_resources = data.shared_resources

    let response = {}
    let formattedPrivate = formatData(
      [...privateFolders, ...private_orphans],
      type
    )
    let formattedShared = formatData(
      [...sharedFolders, ...shared_orphans],
      type
    )
    let formattedAll = formatData(
      [
        ...privateFolders,
        ...sharedFolders,
        ...private_orphans,
        ...shared_orphans,
      ],
      type
    )

    let formatted
    if (scope === 'private') formatted = formattedPrivate
    else if (scope === 'shared') formatted = formattedShared
    else formatted = formattedAll
    response = {
      folders: formatted.data,
      [type]: formatted.items,
      sharedFolders: formattedShared.data,
      privateFolders: formattedPrivate.data,
      ...baseData,
    }
    if (available_source_tags) response.available_tags = available_source_tags
    return response
  } catch (err) {
    toast.error(err)
  }
}

export default fetchFolders
