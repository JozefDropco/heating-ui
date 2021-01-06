<template>
  <div>
    <div class="row">
      <div class="col-6 q-pl-lg q-pb-lg">
        <q-datetime float-label="Od dátumu" v-model="fromDate" type="date" @change="loadCurrentState"/>
        <q-datetime float-label="Do dátumu" v-model="toDate" type="date" @change="loadCurrentState"/>
        <br/>
        <apexchart height="300px" width="500px" :options="tempOptions" :series="tempSeries"></apexchart>
      </div>

      <div class="col-6 q-pl-lg q-pb-lg">
        <div class="row">
          <div class="col-6 q-pl-lg q-pb-lg">
            <apexchart height="300px" width="300px" :options="posOptions" :series="posSeries"></apexchart>
          </div>
          <div class="col-6 q-pl-lg q-pb-lg">
            <q-checkbox disable label="Jas" v-model="enoughLight"/>
            <br/>
            <q-checkbox disable label="Silný vietor" v-model="strongWind"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-6 q-pl-lg q-pb-lg">
        Bolo raz jedno zavlazovanie :D
      </div>
      <div class="col-6 q-pl-lg q-pb-lg">
        Bolo raz jedno kurenie :D
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../heating-config";
import axios from 'axios';


export default Vue.extend({
  data() {
    return {
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
          x: {
            show: true,
            format: 'dd. MM. yyyy HH:mm'
          },
        }
      },
      enoughLight: false,
      strongWind: false,
      lastDate: null,
      posSeries: [],
      posOptions: {
        chart: {
          type: 'scatter',
          stacked: false,
          height: 350,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false,
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
          min: -300,
          max: 20,
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
                _ref.w.globals.categoryLabels[_ref.dataPointIndex] +
                "<br/>Sever/Juh: " +
                _ref.series[_ref.seriesIndex][_ref.dataPointIndex] +
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
            this.lastDate = response.data['lastDate'];
            this.tempSeries = response.data['series'];
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
            var series: any = new Object();
            series['name'] = "Aktuálna pozícia";
            series['data'] = [response.data];
            this.posSeries.push(series);
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
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
              alert(error)
            });
      axios.get(cfg.BASE_URL + "solar/daylight")
          .then(response => {
            this.enoughLight = response.data;
          })
          .catch(error => {
            alert(error)
          })
      axios.get(cfg.BASE_URL + "solar/strongWind")
          .then(response => {
            this.strongWind = response.data;
          })
          .catch(error => {
            alert(error)
          });
      axios.get(cfg.BASE_URL + "solar/currentPosition")
          .then(response => {
            let data: Array<any> = this.posSeries[0]['data'];
            if (data[0]['x'] !== response.data['x'] || data[0]['y'] !== response.data['y']) {
              data[0]['x'] = response.data['x'];
              data[0]['y'] = response.data['y'];
            }
          })
          .catch(error => {
            alert(error)
          });

    }
  },
  mounted(): void {
    let date = new Date();
    date.setDate(this.fromDate.getDate() - 7);
    this.fromDate = date;
    this.loadCurrentState();
    this.refreshIntervalId = setInterval(this.loadDelta, 5000);
  },
  beforeDestroy() {
    clearInterval(this.refreshIntervalId);
  }
});
</script>
