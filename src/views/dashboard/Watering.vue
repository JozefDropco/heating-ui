<template>
  <div>
    <q-checkbox v-model="warmEnough" disable label="Dostatočná teplota"/>
    <br/>
    <q-checkbox v-model="isRainy" disable label="Dážď"/>
    <br/>
    <q-checkbox v-model="pumpRunning" disable label="Pumpa beží"/>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../../heating-config";
import axios from 'axios';


export default Vue.extend({
  data() {
    return {
      warmEnough: false,
      isRainy: false,
      pumpRunning: false,
      refreshIntervalId: null,
    }
  },
  methods: {
    loadCurrentState() {
      axios.get(cfg.BASE_URL + "watering/state")
          .then(response => {
            this.warmEnough = response.data['warmEnough'];
            this.isRainy = response.data['isRainy'];
            this.pumpRunning = response.data['pumpRunning'];
          })
          .catch(error => {
            alert(error)
          });
    },
    loadDelta() {
      axios.get(cfg.BASE_URL + "watering/state")
          .then(response => {
            this.warmEnough = response.data['warmEnough'];
            this.isRainy = response.data['isRainy'];
            this.pumpRunning = response.data['pumpRunning'];
          })
          .catch(error => {
            alert(error)
          });
    }
  },
  mounted(): void {
    this.loadCurrentState();
    this.refreshIntervalId = setInterval(this.loadDelta, 5000);
  },
  beforeDestroy() {
    clearInterval(this.refreshIntervalId);
  }
});
</script>
