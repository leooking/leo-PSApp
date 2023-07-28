export default (prompt) => {
  // prompt: state.prompt.replace(/(\r\n|\n|\r)/gm, ' ')
  return prompt.replace(/\r?\n|\r/g, ' ')
}
