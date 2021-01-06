<template>
  <div id="app">
    <q-layout view="hhr Lpr lff">
      <q-page-container>
        <q-page-sticky position="top-right" :offset="[18, 18]">
          <q-btn color="primary" icon="settings" round label="Nastavenia">
            <!-- Direct child of target -->
                    <q-popover>
                      <left-menu></left-menu>
                    </q-popover>
          </q-btn>
        </q-page-sticky>
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
