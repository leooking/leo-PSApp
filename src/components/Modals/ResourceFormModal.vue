<script setup>
import 'tw-elements'
import CreateResource from '../../sections/resources/CreateResource.vue'
</script>
<template>
  <div class="">
    <div class="flex flex-row md:pl-10">
      <div class="flex items-center text-md">
        <h2>Create Resource</h2>
      </div>
    </div>

    <CreateResource :isModal="true" />
  </div>
</template>
