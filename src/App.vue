<template>
  <div id="app">
    <q-layout view="hhr Lpr lff">
      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LeftMenu from './views/Menu.vue'

export default Vue.extend({
  name: 'app',
  data() {
    return {}
  },
  components: {LeftMenu},
  methods: {}
});
</script>
