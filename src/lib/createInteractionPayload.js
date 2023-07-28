import user from './user'

const createInteractionPayload = (customPayload, interactionState) => {
  const org_pid = user?.org?.org_pid
  let checked
  if (interactionState.useAltChecked) checked = interactionState.altChecked
  else checked = interactionState.checked

  const payload = {
    revision_pid: interactionState.revisionPid,
    prompt: interactionState.promptData.prompt,
    use_my_resources: interactionState.useResources,
    use_external_resources: interactionState.useExternal,
    use_premium_resources: interactionState.usePremium,
    resource_pids: checked,
    qdrant_collections: [],
    ...customPayload,
  }

  if (org_pid) payload.qdrant_collections.push(`psci-bis-${org_pid}-ad`)

  if (interactionState.useExternal || interactionState.usePremium) {
    payload.qdrant_collections.push(...checked)
    delete payload.resource_pids
  } else if (
    !interactionState.useAltResources &&
    !interactionState.useResources &&
    !interactionState.usePremium
  ) {
    delete payload.resource_pids
    delete payload.qdrant_collections
  }

  return payload
}

export default createInteractionPayload
