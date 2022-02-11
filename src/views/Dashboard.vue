<template>
  <div class="q-pa-md">
    <div>
      <q-tabs :value="tabValue" @select="tabchange">
        <q-tab v-if="heating" slot="title" name="actions" label="Akcie">
        </q-tab>
        <q-tab v-if="heating" slot="title" name="temps" label="Teploty">
        </q-tab>
        <q-tab v-if="solar" slot="title" name="solar" label="Kolektory" :default="true">
        </q-tab>
        <q-tab v-if="watering" slot="title" name="watering" label="Zavlažovanie">
        </q-tab>
        <q-tab v-if="heating" slot="title" name="heating" label="Kúrenie">
        </q-tab>
        <q-tab slot="title" name="stats" label="Štatistiky">
        </q-tab>
        <q-tab slot="title" name="logs" label="Hlásenia">
        </q-tab>
        <q-tab slot="title" name="settings" label="Nastavenia"/>
        <q-tab-pane name="actions">
          <actions/>
        </q-tab-pane>
        <q-tab-pane name="temps">
          <temperature/>
        </q-tab-pane>
        <q-tab-pane name="solar">
          <solar/>
        </q-tab-pane>
        <q-tab-pane name="watering">
          <watering/>
        </q-tab-pane>
        <q-tab-pane name="heating">
          <heating/>
        </q-tab-pane>
        <q-tab-pane name="stats">
          <stats/>
        </q-tab-pane>
        <q-tab-pane name="logs">
          <logs/>
        </q-tab-pane>

        <q-tab-pane name="settings">
          <left-menu/>
        </q-tab-pane>
      </q-tabs>
    </div>

  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import cfg from "../heating-config";
import axios from 'axios';
import Temperature from './dashboard/Temperature.vue'
import Solar from './dashboard/Solar.vue'
import Watering from './dashboard/Watering.vue'
import Stats from './dashboard/Stats.vue'
import Logs from './dashboard/Logs.vue'
import Heating from './dashboard/Heating.vue'
import Actions from './dashboard/Actions.vue'
import LeftMenu from "@/views/Menu.vue";


export default Vue.extend({
  components: {LeftMenu, Temperature, Solar, Watering, Stats, Logs, Heating, Actions},
  data() {
    return {
      tabValue: 'solar',
      heating: false,
      watering: false,
      solar: false,
    }
  },
  mounted(): void {
    let tabValue: any = this.$route.query.tabValue;
    if (tabValue !== undefined)
      this.tabValue = tabValue;
    axios.get(cfg.BASE_URL + "configuration")
        .then(response => {
          let set = new Set(response.data);
          this.heating = set.has('--heating');
          this.solar = set.has('--solar');
          this.watering = !set.has('--noWatering');
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error)
        });
  },
  methods: {
    tabchange(value:any) {

      this.$router.push({ query: { tabValue: value}});
    }
  }
});
</script>
