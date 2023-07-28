<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import 'tw-elements'
import * as marked from 'marked'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import { inject } from 'vue'
import RadioButton from 'primevue/radiobutton'

const props = inject('props')
const emit = inject('emit')

const generatorPid = props?.generator?.pid

const router = useRouter()
const assetName = ref('')
const scope = ref('group')

const handleGenerate = async () => {
  try {
    const payload = {
      asset_generator_pid: generatorPid,
      name: assetName.value,
      scope: scope.value,
    }

    // assetz is not a typo
    const res = await api.post('assetz', payload)
    toast.success('Asset generated')
    emit('close')

    // * Vue router wouldn't change page when already on a generator
    window.location = `${window.location.origin}/assets/${res.pid}/${res.generator_type}`
  } catch (err) {
    toast.error(err.message)
  }
}
</script>
<style lang="css">
.asset_instruction {
  max-height: 300px;
  overflow-y: auto;
}
.asset_instruction * {
  padding-top: 5px;
}
</style>
<template>
  <div>
    <h4 class="ml-5" id="generateAssetLabel">
      Generator: {{ props.generator?.name }}
    </h4>
    <p
      class="px-5 mb-4 asset_instruction"
      v-html="marked.parse(props.generator?.asset_instruction)"
      v-if="props.generator?.asset_instruction"
    ></p>

    <form class="md:px-5 w-full" @submit.stop.prevent="handleGenerate()">
      <div class="form-row">
        <div class="form-field w-full">
          <label
            class="text-left block text-gray-700 text-sm font-bold mb-1"
            for="objective"
            >Asset Name
          </label>
          <input
            v-model="assetName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="name"
            type="text"
            placeholder="Something short and memorable"
          />
          <p class="text-right text-s text-gray-400">128 char max</p>
        </div>
      </div>

      <div class="pt-2 pb-8">
        <p class="text-left block text-gray-700 text-sm font-bold mb-1">
          How will this asset be shared?
        </p>
        <div class="flex w-full mt-4 justify-around text-sm">
          <div class="flex">
            <RadioButton
              v-model="scope"
              inputId="mine"
              name="mine"
              value="mine"
              required
            />
            <label for="ingredient1" class="ml-2">I will keep it private</label>
          </div>
          <div class="flex">
            <RadioButton
              v-model="scope"
              inputId="group"
              name="group"
              value="group"
              required
            />
            <label for="ingredient1" class="ml-2">I will share it</label>
          </div>
        </div>
      </div>

      <button
        class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-1 px-6 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Proceed...
      </button>
    </form>
  </div>
</template>
