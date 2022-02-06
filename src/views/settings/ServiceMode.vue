<template>
  <div class="marginLeft5rem marginTop5rem">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/"/>
      <q-breadcrumbs-el label="Servisné menu" to="/ServiceMode"/>
    </q-breadcrumbs>
    <br/>
    <q-tabs value="solar">
      <q-tab slot="title" name="solar" label="Solár" default>
      </q-tab>
      <q-tab slot="title" name="heating" label="Kúrenie">
      </q-tab>
      <q-tab slot="title" name="watering" label="Zavlažovanie">
      </q-tab>
      <q-tab slot="title" name="settings" label="Nastavenia"  />
      <q-tab-pane name="solar">
        <solar/>
      </q-tab-pane>
      <q-tab-pane name="heating">
        <heating/>
      </q-tab-pane>
      <q-tab-pane name="watering">
        <watering/>
      </q-tab-pane>
      <q-tab-pane name="settings">
        <left-menu/>
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import Solar from './servicemode/SolarServiceMode.vue';
import Watering from './servicemode/WateringServiceMode.vue';
import Heating from './servicemode/HeatingServiceMode.vue';
import LeftMenu from "@/views/Menu.vue";

require('url-search-params-polyfill');
export default Vue.extend({
  components: {Solar, Watering, Heating,LeftMenu}
})
</script>
<style>
.heading {
  font-size: large;
  font-weight: bold;
}

.marginLeft5rem {
  margin-left: 0.5rem;
}

.marginTop5rem {
  margin-top: 0.5rem;
}

.paddingBottom {
  padding-bottom: 0.5rem;
}

.window {
  padding: 1rem 2rem;
}
</style>
