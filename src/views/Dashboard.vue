<template>

  <q-tabs inverted animated swipeable glossy align="justify">
    <q-tab default name="temp" slot="title" label="Teploty"/>
    <q-tab name="solar" slot="title" label="Kolektory"/>
    <q-tab name="watering" slot="title" label="Zavlažovanie"/>
    <q-tab name="heating" slot="title" label="Kúrenie"/>

    <q-tab-pane name="temp">
      <div style="margin-top: 20px">
        <div class="row">
          <div class="col-6 q-pl-lg q-pb-lg">
            <q-datetime float-label="Od dátumu" v-model="fromDate" type="date" @change="loadCurrentState"/>
          </div>
          <div class="col-6 q-pl-lg q-pb-lg">
            <q-datetime float-label="Do dátumu" v-model="toDate" type="date" @change="loadCurrentState"/>
          </div>
        </div>
        <apexchart :options="tempOptions" :series="tempSeries"></apexchart>
      </div>
    </q-tab-pane>
    <q-tab-pane name="solar">
      <div class="row">
        <div class="col-6 q-pl-lg q-pb-lg">
          <apexchart height="450px" width="450px" :options="posOptions" :series="posSeries"></apexchart>
        </div>
        <div class="col-6 q-pl-lg q-pb-lg">
          <q-checkbox  disable label="Jas" v-model="enoughLight"/><br/>
          <q-checkbox disable label="Silný vietor" v-model="strongWind"/>

        </div>
      </div>
    </q-tab-pane>
    <q-tab-pane name="watering">Bolo raz jedno zavlazovanie :D</q-tab-pane>
    <q-tab-pane name="heating">Bolo raz jedno kurenie :D</q-tab-pane>
  </q-tabs>

</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../heating-config";
import axios from 'axios';


export default Vue.extend({
  data() {
    return {
      refreshIntervalId:null,
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
        legend: {
          position: 'top'
        },
        tooltip: {
          x: {
            show: true,
            format: 'dd. MM. yyyy HH:mm'
          },
        }
      },
      enoughLight: false,
      strongWind: false,
      posSeries: [],
      posOptions: {
        chart: {
          type: 'scatter',
          stacked: false,
          height: 350,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 15,
        },
        title: {
          text: 'Pozícia kolektorov',
          align: 'left'
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          },
        },
        yaxis: {
          type: 'number',
          show: false,
          min: -135,
          max: 0
        },
        xaxis: {
          type: 'number',
          show: false,
          min: -280,
          max: 0,
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false
          }
        },
        annotations: {
          yaxis: [
            {
              y: -63,
              strokeDashArray: 0,
              borderColor: "#333",
              fillColor: "#c2c2c2",
              opacity: 0.8,
              offsetX: 0,
              offsetY: 0
            }
          ],
          xaxis: [
            {
              x: -140,
              strokeDashArray: 0,
              borderColor: "#333",
              fillColor: "#c2c2c2",
              opacity: 0.8,
              offsetX: 0,
              offsetY: 0,
            }
          ],
          points: [
            {
              x: -280,
              y: -62.5,
              marker: {size: 0},
              label: {text: "Západ", textAnchor: 'start'}
            }, {
              x: 0,

              y: -62.5,
              marker: {size: 0},
              label: {text: "Východ", textAnchor: 'end'}
            }, {
              x: -140,
              y: -0,
              marker: {size: 0},
              label: {text: "Sever"}
            }, {
              x: -140,
              y: -135,
              marker: {size: 0},
              label: {text: "Juh"}
            }

          ]
        },
        tooltip: {
          custom: function (_ref: any) {
            return (
                "<div>" +
                " Východ/Západ:   " +
                _ref.w.globals.seriesX[_ref.seriesIndex][_ref.dataPointIndex] +
                "<br/>Sever/Juh: " +
                _ref.w.globals.series[_ref.seriesIndex][_ref.dataPointIndex] +
                "</div>");
          }
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
            this.tempSeries = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
      axios.get(cfg.BASE_URL + "solar/daylight")
          .then(response => {
            this.enoughLight = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          })
      axios.get(cfg.BASE_URL + "solar/strongWind")
          .then(response => {
            this.strongWind = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
      axios.get(cfg.BASE_URL + "solar/currentPosition")
          .then(response => {
            this.posSeries.splice(0);
            var series:any=new Object();
            series['name']= "Aktuálna pozícia";
            series['data']= [response.data];
            this.posSeries.push(series);
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    }
  },
  mounted(): void {
    let date = new Date();
    date.setDate(this.fromDate.getDate() - 7);
    this.fromDate = date;
    this.loadCurrentState();
    this.refreshIntervalId = setInterval(this.loadCurrentState, 5000);
  },
  beforeDestroy() {
    clearInterval(this.refreshIntervalId);
  }
});
</script>
