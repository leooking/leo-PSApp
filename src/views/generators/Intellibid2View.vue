<script setup>
import InteractionWrapper from '../../components/InteractionWrapper.vue'
import ViewResource from '../../sections/resources/ViewResource.vue'
import Intellibid from '../../sections/Intellibid2/Intellibid.vue'
</script>
<template>
  <InteractionWrapper :noScrollbar="true">
    <template #alternateSidebar>
      <ViewResource />
    </template>
    <template #default>
      <Intellibid />
    </template>
  </InteractionWrapper>
</template>
