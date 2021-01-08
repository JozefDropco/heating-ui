<template>
  <div class="q-pa-md">
    <div>
      <q-card class="q-ma-md" inline>
        <q-card-title>
          Teploty
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <q-datetime v-model="fromDate" float-label="Od dátumu" type="date" @change="loadCurrentState"/>
          <q-datetime v-model="toDate" float-label="Do dátumu" type="date" @change="loadCurrentState"/>
          <br/>
          <apexchart :options="tempOptions" :series="tempSeries" height="300px" width="500px"></apexchart>
        </q-card-main>
      </q-card>
      <q-card class="q-ma-md" inline>
        <q-card-title>
          Kolektory
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <div class="row">
            <div>
              <apexchart :options="posOptions" :series="posSeries" height="300px" width="300px"></apexchart>
            </div>
            <div class="w-100"/>
            <div>
              <q-checkbox v-model="enoughLight" disable label="Jas"/>
              <br/>
              <q-checkbox v-model="strongWind" disable label="Silný vietor"/>
              <br/>
              <q-checkbox v-model="overHeated" disable label="Prehriate"/>
              <br/>
              <br/>
              {{ collectorPosition }}

            </div>
          </div>
          <b>Nadchádzajúce natáčania pre dnešný deň</b>
          <table style="width: 100%; text-align: center">
            <tr>
              <th>Čas</th>
              <th>Vertikálne</th>
              <th>Horintálne</th>
            </tr>
            <tr v-for="item in remainingPositions" :key="item.hour">
              <td>{{ item.hour }}:{{ item.minute }}</td>
              <td>{{ item.vert }}</td>
              <td>{{ item.hor }}</td>
            </tr>
          </table>
        </q-card-main>
      </q-card>
      <q-card class="q-ma-md" inline>
        <q-card-title>
          Zavlažovanie
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <q-checkbox v-model="warmEnough" disable label="Dostatočná teplota"/>
          <br/>
          <q-checkbox v-model="isRainy" disable label="Dážď"/>
          <br/>
          <q-checkbox v-model="pumpRunning" disable label="Pumpa beží"/>
        </q-card-main>
      </q-card>

      <q-card class="q-ma-md" inline>
        <q-card-title>
          Kúrenie
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          Stav kurenia (bezi kotol, krb, Stav cerpadiel a trojcestnych ventilov)
        </q-card-main>
      </q-card>
      <q-card class="q-ma-md" inline>
        <q-card-title>
          Štatistiky
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          Bolo nebolo, ale ked raz bude tak zobrazime statistiky za dane obdobie (den, tento mesiac, minule mesiace,
          roky)
        </q-card-main>
      </q-card>
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
      warmEnough:false,
      isRainy:false,
      pumpRunning:false,
      refreshIntervalId: null,
      tempSeries: [],
      remainingPositions: [],
      collectorPosition: "Natáčanie zastavené",
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
      overHeated: false,
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
          text: 'Pozícia',
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
          min: 0,
          max: 135,
          reversed: true,
        },
        xaxis: {
          type: 'number',
          show: false,
          min: -20,
          max: 300,
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
              x: 0,
              y: 62.5,
              marker: {size: 0},
              label: {text: "Západ"}
            }, {
              x: 280,
              y: 62.5,
              marker: {size: 0},
              label: {text: "Východ"}
            }, {
              x: 140,
              y: 0,
              marker: {size: 0},
              label: {text: "Sever"}
            }, {
              x: 140,
              y: 135,
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

      axios.get(cfg.BASE_URL + "solar/currentState")
          .then(response => {
            this.strongWind = response.data['windy'];
            this.enoughLight = response.data['dayLight'];
            this.overHeated = response.data['overHeated'];
            this.remainingPositions = response.data['remainingPositions'];
            this.posSeries.splice(0);
            var series: any = new Object();
            series['name'] = "Aktuálna pozícia";
            series['data'] = [response.data['pos']];
            this.posSeries.push(series);
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
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

      axios.get(cfg.BASE_URL + "solar/currentState")
          .then(response => {
            this.strongWind = response.data['windy'];
            this.overHeated = response.data['overHeated'];
            this.enoughLight = response.data['dayLight'];
            this.remainingPositions = response.data['remainingPositions'];
            let data: Array<any> = this.posSeries[0]['data'];
            if (data[0]['x'] !== response.data['pos']['x'] || data[0]['y'] !== response.data['pos']['y']) {
              data[0]['x'] = response.data['pos']['x'];
              data[0]['y'] = response.data['pos']['y'];
            }
            var movement: Array<String> = response.data['movement'];
            if (movement !== undefined && movement.length !== 0) {
              var text = "Natáčam na ";
              for (var i = 0; i < movement.length; i++) {
                if (i > 0) text = text + ", ";
                if (movement[i] === 'NORTH') {
                  text = text + " Sever";
                }
                if (movement[i] === 'SOUTH') {
                  text = text + " Juh";
                }
                if (movement[i] === 'EAST') {
                  text = text + " Východ";
                }
                if (movement[i] === 'WEST') {
                  text = text + " Západ";
                }
              }
              this.collectorPosition = text;
            }
          })
          .catch(error => {
            alert(error)
          });
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
