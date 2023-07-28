import api from './axiosClient'
import createInteractionPayload from './createInteractionPayload'

const execute = async (
  interactionState,
  setLoading,
  toBottom,
  payload,
  onComplete,
  customName
) => {
  setLoading(true)
  interactionState.processingPrompt = payload.prompt
    ? payload.prompt
    : interactionState.promptData.prompt
  initWebSocket(interactionState, toBottom, payload, onComplete, customName)
}

const initWebSocket = (
  interactionState,
  toBottom,
  payload,
  onComplete,
  customName
) => {
  let websocket

  // Initialize websocket if it's not created or closed
  if (!websocket || websocket.readyState === WebSocket.CLOSED) {
    let name
    if (customName) name = customName
    else if (interactionState?.asset?.generator_type === 'smartcheck')
      name = 'smartcheck'
    else if (interactionState?.asset?.generator_type === 'intellibid-2')
      name = 'snippet'
    else
      name = `chat/${interactionState?.asset?.generator_name
        ?.split(' ')
        .join('_')
        .toLowerCase()}`

    websocket = new WebSocket(`wss://${VITE_CHAINS_URL}${name}`)

    websocket.onopen = (event) =>
      handleInteraction(interactionState, websocket, toBottom, payload)

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      const message = data.message
      const status = data.status
      const total_tokens = data.total_tokens
      const citations = data.citations

      if (data.type === 'error')
        console.error('WebSocket received an error:', message)
      else if (message) {
        interactionState.processingResponse += message
        interactionState.processingResponse =
          interactionState.processingResponse?.replace(/null/g, '')
      } else if (total_tokens)
        sessionStorage.setItem('total_tokens', total_tokens)
      else if (status === 'DONE')
        completeInteraction(
          interactionState,
          payload,
          onComplete,
          toBottom,
          citations
        )
      interactionState.promptData.prompt = ''

      toBottom()
    }

    websocket.onerror = (event) => {
      console.error('WebSocket encountered an error:', event)
    }
  }

  return websocket
}

const handleInteraction = (interactionState, websocket, toBottom, payload) => {
  websocket.send(
    JSON.stringify(
      createInteractionPayload(
        {
          prompt: interactionState.processingPrompt,
          interactions: interactionState.asset.interactions,
          generator_name: interactionState.asset.generator_name,
          ...payload,
        },
        interactionState
      )
    )
  )

  interactionState.promptData.prompt = ''
  toBottom()
}

const completeInteraction = async (
  interactionState,
  payload,
  onComplete,
  toBottom,
  citations
) => {
  let newCitations = citations
    ? citations.map((citation) => {
        return {
          resource_pid: citation.resource_pid,
          resource_name: citation.resource_name,
          relevant_chunk: citation.relevant_chunk,
        }
      })
    : []
    console.log("=====================================");
    console.log(interactionState);
  await api.post(
    'assetz/' + interactionState.asset.pid + '/interaction',
    createInteractionPayload(
      {
        ...payload,
        prompt: interactionState.processingPrompt,
        response: interactionState.processingResponse,
        total_tokens: sessionStorage.getItem('total_tokens'),
        citations: newCitations,
      },
      interactionState
    )
  )

  try {
    await onComplete()
    interactionState.processingPrompt = null
    interactionState.processingResponse = null

    toBottom()
  } catch (err) {
    await onComplete()
    interactionState.processingPrompt = null
    interactionState.processingResponse = null

    toBottom()
  }
}

export { handleInteraction, initWebSocket, execute }
