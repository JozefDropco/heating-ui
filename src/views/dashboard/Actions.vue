<template>
  <div>
    <q-btn  :color="parkingPositionColor" v-html="'Parkovacia <br>poloha<br> kolektorov'"  class="actions" @click="parkingPosition" />
    <br/>
    <br/>
    <q-btn :color="heatingColor" v-html="'Ohrev <br> vody v TA3 <br> plynovým <br> kotlom'" class="actions" @click="oneTimeHeat" />

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
      parkingPositionColor: 'primary',
      heatingColor: 'primary',
    }
  },
  methods: {
    loadCurrentState() {
      axios.get(cfg.BASE_URL + "solar/parkingPosition").then(response=>{
        if (response.data) this.parkingPositionColor= 'green'; else this.parkingPositionColor = 'primary';
      });
      axios.get(cfg.BASE_URL + "heating/manualWaterBoilerHeat").then(response=>{
        if (response.data) this.heatingColor= 'green'; else this.heatingColor='primary';
      });
    },
    parkingPosition() {
      axios.post(cfg.BASE_URL + "solar/parkingPosition")
          .then(response => {
            if (response.data) this.parkingPositionColor= 'green'; else this.parkingPositionColor = 'primary';
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    oneTimeHeat() {
      axios.post(cfg.BASE_URL + "heating/manualWaterBoilerHeat")
          .then(response => {
            if (response.data) this.heatingColor= 'green'; else this.heatingColor = 'primary';
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    }
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
<style>
.actions{
  width: 140px;
}
</style>
