<template>
  <div>
          <q-datetime v-model="fromDate" float-label="Od dátumu" type="date" @change="loadCurrentState" :first-day-of-week="1"/>
          <q-datetime v-model="toDate" float-label="Do dátumu" type="date" @change="loadCurrentState" :first-day-of-week="1"/>
          <br/>
          <apexchart :options="tempOptions" :series="tempSeries" height="300px" width="500px"></apexchart>
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
      lastDate: null,
      refreshIntervalId: null,
      tempSeries: [],
      tempOptions: {
        chart: {
          type: 'line',
          stacked: false,
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        colors:['#008FFB','#FEB019','#00E396','#FF4560'],
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Teplota',
          align: 'left'
        },
        yaxis: {
          type: 'number',
          title: {
            text: 'Teplota'
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'dd. MM. yyyy'
          },
          minHeight: 120,
          maxHeight: 120
        },
        tooltip: {
          enabled:true,
          shared:true,
          x: {
            show: true,
            format: 'dd. MM. yyyy HH:mm'
          },
        }
      },
      fromDate: new Date(),
      toDate: new Date(),
    }
  },
  methods: {
    loadCurrentState() {
      Loading.show();
      var fromValue = this.fromDate.toISOString().slice(0, 10);
      let date = new Date(this.toDate);
      date.setDate(date.getDate() + 1);
      var toValue = date.toISOString().slice(0, 10);
      axios.get(cfg.BASE_URL + "temp?from=" + fromValue + "&to=" + toValue)
          .then(response => {
            this.lastDate = response.data['lastDate'];
            this.tempSeries = response.data['series'];
            // eslint-disable-next-line
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            // eslint-disable-next-line
            console.log(error)
          });
    },
    loadDelta() {
      if (this.lastDate !== null)
        axios.get(cfg.BASE_URL + "temp/delta?last=" + this.lastDate)
            .then(response => {
              this.lastDate = response.data['lastDate'];
              let currSeries: Array<any> = response.data['series'];
              for (var i = 0; i < currSeries.length; i++) {
                var found: boolean = false;
                for (var j = 0; j < this.tempSeries.length; j++) {
                  if (this.tempSeries[j]['name'] === currSeries[i]['name']) {
                    found = true;
                    this.tempSeries[j]['data'].push(currSeries[i]['data']);
                  }
                  if (!found) {
                    this.tempSeries.push(currSeries[i]);
                  }
                }
              }
            })
            .catch(error => {
              // eslint-disable-next-line
              console.log(error)
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
