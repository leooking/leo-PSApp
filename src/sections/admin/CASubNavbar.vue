<template>
  <nav>
    <RouterLink
      class="text-gray-500 hover:underline mr-3"
      to="/admin"
      id="ca_dashboard"
    >
      Dashboard
    </RouterLink>
    <RouterLink
      class="text-gray-500 hover:underline mr-3"
      to="/admin/licenses"
      id="ca_licenses"
    >
      Licenses
    </RouterLink>
  </nav>
</template>

<script>
export default {
  name: 'CASubNavbar',
}
</script>

<style scoped></style>
