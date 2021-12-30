<template>
  <div>
    <q-btn  ref="parkPos" :color="parkingPositionColor" :disable="parkingDisabled" v-html="'Parkovacia <br>poloha<br> kolektorov'"  class="actions" @click="parkingPosition" :title="parkingDisabled ? 'V parkovacej polohe':''"/>
    <br/>
    <br/>
    <q-btn color="primary" v-html="'Ohrev <br> vody v TA3 <br> plynovým <br> kotlom'" class="actions" disable/>

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
      parkingDisabled:true
    }
  },
  methods: {
    loadCurrentState() {
      axios.get(cfg.BASE_URL + "solar/parkingPosition").then(response=>{
        this.parkingDisabled = response.data;
        if (this.parkingDisabled) this.parkingPositionColor= 'green';
      });
    },
    parkingPosition() {
      axios.post(cfg.BASE_URL + "solar/parkingPosition")
          .then(response => {
            this.parkingDisabled = true;
            if (this.parkingDisabled) this.parkingPositionColor= 'green';
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
