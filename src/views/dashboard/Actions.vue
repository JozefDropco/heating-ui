<template>
  <div>
    <q-btn :color="parkingPositionColor" v-html="'Parkovacia poloha kolektorov'" class="actions"
           @click="parkingPosition"/>
    <br/>
    <br/>
    <q-btn :color="heatingColor" v-html="'Ohrev vody v TA3 plynovým kotlom'" class="actions"
           @click="oneTimeHeat"/>
    <br/>
    <br/>
    <q-btn :color="holidayModeColor" v-html="holidayModeText" class="actions" @click="holidayModeBtn"/>
    <q-modal v-model="showHolidayDialog">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Prázdninový mód
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <q-datetime v-model="holidayFrom" float-label="Od" type="datetime" format24h format="DD. MM. YYYY HH:mm"
                      :first-day-of-week="1"/>
          <q-datetime v-model="holidayTo" float-label="Do" type="datetime" format24h format="DD. MM. YYYY HH:mm"
                      :first-day-of-week="1"/>
          <br/>
          <q-btn
              color="primary"
              v-close-overlay
              label="Nastaviť"
              @click="holidayMode()"
          />
          <q-btn
              color="primary"
              v-close-overlay @click="showHolidayDialog=false"
              label="Zavrieť"
          />

        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../../heating-config";
import axios from 'axios';
import moment from "moment";


export default Vue.extend({
  data() {
    return {
      refreshIntervalId: null,
      parkingPositionColor: 'primary',
      showHolidayDialog: false,
      heatingColor: 'primary',
      holidayModeColor: 'primary',
      holidayFrom: new Date(),
      holidayTo: new Date(),
      holidayModeText: "Prázdninový mód"
    }
  },
  methods: {
    loadCurrentState() {
      axios.get(cfg.BASE_URL + "solar/parkingPosition").then(response => {
        if (response.data) this.parkingPositionColor = 'green'; else this.parkingPositionColor = 'primary';
      });
      axios.get(cfg.BASE_URL + "heating/manualWaterBoilerHeat").then(response => {
        if (response.data) this.heatingColor = 'green'; else this.heatingColor = 'primary';
      });
      axios.get(cfg.BASE_URL + "heating/holidayMode").then(response => {
        if (response.data.state) this.holidayModeColor = 'green'; else {
          this.holidayModeColor = 'primary';
          this.holidayModeText="Prázdninový mód"
        }
        if (response.data.fromDate !== undefined && response.data.fromDate !== null) {
          this.holidayFrom=moment(response.data.fromDate,'YYYY-MM-DD HH:mm').toDate();
          this.holidayTo=moment(response.data.toDate,'YYYY-MM-DD HH:mm').toDate();
          this.holidayModeText= "Prázdninový mód je naplánovaný<br>" +
              "Od: "+moment(this.holidayFrom).format('DD. MM. YYYY HH:mm')+"<br>"+
              "Do: "+moment(this.holidayTo).format('DD. MM. YYYY HH:mm');
        }
      });
    },
    parkingPosition() {
      axios.post(cfg.BASE_URL + "solar/parkingPosition")
          .then(response => {
            if (response.data) this.parkingPositionColor = 'green'; else this.parkingPositionColor = 'primary';
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
            if (response.data) this.heatingColor = 'green'; else this.heatingColor = 'primary';
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    holidayModeBtn() {
      if (this.holidayModeColor === 'primary') {
        this.showHolidayDialog = true;
      } else {
        axios.post(cfg.BASE_URL + "heating/holidayMode")
            .then(response => {
              if (response.data) this.holidayModeColor = 'green'; else {
                this.holidayModeColor = 'primary';
                this.holidayModeText="Prázdninový mód";
              }
              Loading.hide();
            })
            .catch(error => {
              Loading.hide();
              console.log(error)
            });
      }
    },
    holidayMode() {
      this.showHolidayDialog = false;
      let url = cfg.BASE_URL + "heating/holidayMode?";
      if (this.holidayFrom !== undefined && this.holidayFrom != null) {
        url = url + "fromDate="+moment(this.holidayFrom).format('YYYY-MM-DD HH:mm');
        url = url + "&toDate="+moment(this.holidayTo).format('YYYY-MM-DD HH:mm');
      }
      axios.post(url)
          .then(response => {
            if (response.data) this.holidayModeColor = 'green'; else this.holidayModeColor = 'primary';
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
.actions {
  width: 200px;
}
</style>
