<template>
  <div>
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
      remainingPositions: [],
      collectorPosition: "Natáčanie zastavené",
      enoughLight: false,
      strongWind: false,
      overHeated: false,
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
    }
  },
  methods: {
    loadCurrentState() {

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
    },
    loadDelta() {
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
