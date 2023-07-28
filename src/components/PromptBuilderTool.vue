<script setup>
import CascadeSelect from 'primevue/cascadeselect'
import { ref } from 'vue'

const selectedNode = ref()
const nodes = ref([
  {
    name: 'Persona',
    code: 'pr',
    states: [
      { label: 'Proposal Writer', code: '1' },
      { label: 'Solution Architect', code: '1' },
      { label: 'Proposal Manager', code: '1' },
      { label: 'Capture Manager', code: '1' },
      { label: 'Business Analyst', code: '1' },
      { label: 'Marketing Manager', code: '1' },
      { label: 'Account Manager', code: '1' },
      { label: 'Project Manager', code: '1' },
      { label: 'Contracts Manager', code: '1' },
      { label: 'Customer Relations Manager', code: '1' },
      { label: 'Chief Growth Officer', code: '1' },
      { label: 'Business Development Manager', code: '1' },
      { label: 'Pricing Analyst', code: '1' },
      { label: 'Program Manager', code: '1' },
      { label: 'Software Developer', code: '1' },
    ],
  },
  {
    name: 'Tone',
    code: 'to',
    states: [
      { label: 'Technical', code: '2' },
      { label: 'Descriptive', code: '2' },
      { label: 'Innovative', code: '2' },
      { label: 'Inspiring', code: '2' },
      { label: 'Persuasive', code: '2' },
      { label: 'Creative', code: '2' },
      { label: 'Academic', code: '2' },
      { label: 'Business', code: '2' },
      { label: 'Friendly', code: '2' },
      { label: 'Journalistic', code: '2' },
      { label: 'Scientific', code: '2' },
    ],
  },
  {
    name: 'Task',
    code: 'tk',
    states: [
      { label: 'market research plan', code: '3' },
      { label: 'customer relationship improvement plan', code: '3' },
      { label: 'system architecture', code: '3' },
      { label: 'idea solution map', code: '3' },
      { label: 'government solicitation capture plan', code: '3' },
      { label: 'proposal win strategy', code: '3' },
      { label: 'proposal executive summary', code: '3' },
      { label: 'compliance matrix', code: '3' },
      { label: 'career self improvement plan', code: '3' },
      { label: 'proposal management plan', code: '3' },
      { label: 'competitive analysis', code: '3' },
      { label: 'pricing strategy for a solicitation', code: '3' },
      { label: 'contract negotiations plan', code: '3' },
      { label: 'marketing strategy', code: '3' },
      { label: 'professional email', code: '3' },
      { label: 'government contracting growth plan', code: '3' },
      { label: 'project management plan', code: '3' },
    ],
  },
  {
    name: 'Text Editing',
    code: 'te',
    states: [
      { label: 'Summarize', code: '4' },
      { label: 'Refine', code: '4' },
      { label: 'Grammar check', code: '4' },
      { label: 'Enhance', code: '4' },
      { label: 'Make more informative', code: '4' },
      { label: 'Make more technical', code: '4' },
      { label: 'Suggest improvements on', code: '4' },
      { label: 'Increase readability of', code: '4' },
      { label: 'Clarify ', code: '4' },
      { label: 'Simplify', code: '4' },
      { label: 'Make more professional', code: '4' },
      { label: 'Redact Important Information in', code: '4' },
      { label: 'Restructure', code: '4' },
      { label: 'Translate', code: '4' },
      { label: 'Paraphrase', code: '4' },
      { label: 'Proofread', code: '4' },
      { label: 'Rewrite', code: '4' },
    ],
  },
  {
    name: 'Format',
    code: 'fr',
    states: [
      { label: 'Summary', code: '5' },
      { label: 'Narrative', code: '5' },
      { label: 'Report', code: '5' },
      { label: 'Bullet List', code: '5' },
      { label: 'Numbered List', code: '5' },
      { label: 'CSV', code: '5' },
      { label: 'Email', code: '5' },
      { label: 'Table', code: '5' },
      { label: 'Code', code: '5' },
    ],
  },
])

const emit = defineEmits(['toggleSeason'])

const handleCascadeSelect = (e) => {
  emit('toggleSeason', e.value.label, e.value.code)
  selectedNode.value = "";
}
  
</script>
<style>
.p-cascadeselect-item-active > .p-cascadeselect-sublist {
  bottom: 0% !important;
  top: auto !important;
}
.p-cascadeselect .p-cascadeselect-label {
  color: white;
}
.p-cascadeselect .p-cascadeselect-label.p-placeholder {
  color: #ffffff;
}
.p-cascadeselect:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 0.2rem #5b5b5b !important;
  border-color: #000 !important;
}
.p-cascadeselect-trigger {
  position: absolute;
  right: 0;
  height: 100%;
}
</style>

<template>
  <div class="card flex justify-content-center min-w-[200px]">
    <CascadeSelect
      v-on:change="handleCascadeSelect"
      class="bg-psci hover:bg-gold text-white hover:text-black px-3 rounded focus:outline-none w-full text-center"
      v-model="selectedNode"
      :options="nodes"
      optionLabel="label"
      optionGroupLabel="name"
      :optionGroupChildren="['states']"
      placeholder="Prompt Builder"
    />
  </div>
</template>
