import { getItem } from './storage'

const sendAutosave = async (interactionState) => {
  fetch(`${VITE_API_URL}/assetz/${interactionState.asset.pid}/autosave`, {
    keepalive: true,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': getItem('apiKey'),
      authorization: `Bearer ${getItem('actok')}`,
    },
    body: JSON.stringify({ current_content: interactionState.artifact }),
  })
}
const autosave = (interactionState) => {
  if (interactionState) {
    try {
      sendAutosave(interactionState)
    } catch (err) {
      sendAutosave(interactionState)
    }
  }
}

export default autosave
