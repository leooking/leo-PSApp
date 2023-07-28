const getCharacterLimit = (interactionState, extra, as) => {
  const asset = interactionState.asset
  const { generator_max_tokens } = asset

  // * 4096 is for GPT V 3.5 (currently has 16k limit with new endpoint)
  // * 8000 is for GPT V 4

  const limits = {
    convo: {
      4096: 34000,
      8000: 16625,
    },
    multi: {
      customWords: {
        4096: 13580,
        8000: 6650,
      },
      requirement: {
        4096: 20440,
        8000: 9975,
      },
    },
    smartcheck: {
      requirement: {
        4096: 13600,
        8000: 6650,
      },
      response: {
        4096: 20440,
        8000: 6475,
      },
    },
    'intellibid-2': {
      customWords: {
        4096: 13580,
        8000: 6650,
      },
      'maximum-highlight': {
        4096: 20440,
        8000: 9975,
      },
    },
  }

  try {
    const name = asset.generator_type?.toLowerCase()
    if (as && limits[as]) return limits[as][parseInt(generator_max_tokens)]
    else if (limits[name] && extra && limits[name][extra][generator_max_tokens])
      return limits[name][extra][generator_max_tokens]
    else return limits[name][parseInt(generator_max_tokens)]
  } catch (err) {
    return 2000
  }
}

export default getCharacterLimit
