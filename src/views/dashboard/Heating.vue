<template>
  <div>
    <q-checkbox v-model="solarCircularPump" disable label="Kolektory - obehové čerpadlo"/>
    <br/>
    <q-checkbox v-model="heatingBoiler" disable label="Ohrev TA3"/>
    <br/>
    <q-checkbox v-model="threeWayBypass" disable label="3-cestný ventil - bypass"/>
    <br/>
    <q-checkbox v-model="threeWayOpened" disable label="3-cestný ventil - otvorený"/>
    <br/>
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
      refreshIntervalId: null,
      solarCircularPump: false,
      heatingBoiler: false,
      threeWayBypass: false,
      threeWayOpened: false
    }
  },
  methods: {
    loadCurrentState() {

      axios.get(cfg.BASE_URL + "heating")
          .then(response => {
            this.solarCircularPump = response.data['solarCircularPump'];
            this.heatingBoiler = response.data['heatingBoiler'];
            this.threeWayBypass = response.data['threeWayBypass'];
            this.threeWayOpened = response.data['threeWayOpened'];
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    },
  },
  mounted(): void {
    this.loadCurrentState();
    this.refreshIntervalId = setInterval(this.loadCurrentState, 5000);
  },
  beforeDestroy() {
    clearInterval(this.refreshIntervalId);
  }
});
</script>
