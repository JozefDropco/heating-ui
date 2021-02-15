<template>
  <div>
    <q-checkbox v-model="solarCircularPump" disable label="Kolektory - obehové čerpadlo"/>
    <br/>
    <q-checkbox v-model="heatingBoilerBlock" disable label="Blokovanie ohrevu TA3"/>
    <br/>
    <q-checkbox v-model="threeWayBypass" disable label="3-cestný ventil - bypass"/>
    <br/>
    <q-checkbox v-model="threeWayOpened" disable label="3-cestný ventil - otvorený"/>
    <br/>
    <q-checkbox v-model="heaterFlame" disable label="Horák plynového kotla"/>
    <br/>
    <q-checkbox v-model="heaterBoiler" disable label="Ohrev TA3 plynovým kotlom"/>
    <br/>
    <q-checkbox v-model="heaterCircularPump" disable label="Kúrenie chod čerpadla"/>
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
      heatingBoilerBlock: false,
      threeWayBypass: false,
      threeWayOpened: false,
      heaterFlame:false,
      heaterBoiler:false,
      heaterCircularPump:false
    }
  },
  methods: {
    loadCurrentState() {

      axios.get(cfg.BASE_URL + "heating")
          .then(response => {
            this.solarCircularPump = response.data['solarCircularPump'];
            this.heatingBoilerBlock = response.data['heatingBoilerBlock'];
            this.threeWayBypass = response.data['threeWayBypass'];
            this.threeWayOpened = response.data['threeWayOpened'];
            this.heaterFlame = response.data['heaterFlame'];
            this.heaterBoiler = response.data['heaterBoiler'];
            this.heaterCircularPump = response.data['heaterCircularPump'];
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
