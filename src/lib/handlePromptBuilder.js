const handlePromptBuilder = (value, state) => {
  state.promptBuilderText.label = value.label
  state.promptBuilderText.code = value.code
  if (state.promptBuilderText.code != 0) {
    if (state.promptBuilderText.code == '1') {
      state.promptData.prompt =
        'Act as a ' +
        state.promptBuilderText.label.toLowerCase() +
        '. ' +
        state.promptData.prompt
    }
    if (state.promptBuilderText.code == '2') {
      state.promptData.prompt =
        'Respond in a ' +
        state.promptBuilderText.label.toLowerCase() +
        ' tone.' +
        ' ' +
        state.promptData.prompt
    }
    if (state.promptBuilderText.code == '3') {
      state.promptData.prompt =
        'Create a ' +
        state.promptBuilderText.label.toLowerCase() +
        '. ' +
        state.promptData.prompt
    }
    if (state.promptBuilderText.code == '4') {
      state.promptData.prompt =
        state.promptBuilderText.label +
        ' the following text. ' +
        state.promptData.prompt
    }
    if (state.promptBuilderText.code == '5') {
      state.promptData.prompt =
        'Format the response as a ' +
        state.promptBuilderText.label.toLowerCase() +
        '. ' +
        state.promptData.prompt
    }
  }
}

export default handlePromptBuilder
