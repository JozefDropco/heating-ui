<template>
  <div class="q-pa-md">
    <div>
      <q-card v-if="heating" class="q-ma-md" inline>
        <q-card-title>
          Akcie
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <actions/>
        </q-card-main>
      </q-card>
      <q-card v-if="heating" class="q-ma-md" inline>
        <q-card-title>
          Teploty
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <temperature/>
        </q-card-main>
      </q-card>
      <q-card v-if="solar" class="q-ma-md" inline>
        <q-card-title>
          Kolektory
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <solar/>
        </q-card-main>
      </q-card>
      <q-card v-if="watering" class="q-ma-md" inline>
        <q-card-title>
          Zavlažovanie
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <watering/>
        </q-card-main>
      </q-card>

      <q-card v-if="heating" class="q-ma-md" inline>
        <q-card-title>
          Kúrenie
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <heating/>
        </q-card-main>
      </q-card>
      <q-card class="q-ma-md" inline>
        <q-card-title>
          Štatistiky
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <stats/>
        </q-card-main>
      </q-card>

      <q-card class="q-ma-md" inline>
        <q-card-title>
          Hlásenia
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <logs/>
        </q-card-main>
      </q-card>
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


export default Vue.extend({
  components: {Temperature, Solar, Watering, Stats, Logs, Heating, Actions},
  data() {
    return {
      heating: false,
      watering: false,
      solar: false,
    }
  },
  mounted(): void {
    axios.get(cfg.BASE_URL + "configuration")
        .then(response => {
          let set = new Set(response.data);
          this.heating = set.has('--heating');
          this.solar = set.has('--solar');
          this.watering = !set.has('--noWatering');
        })
        .catch(error => {
          console.log(error)
        });
  }
});
</script>
