<template>
  <div>
    <div class="row">
      <div>
        <apexchart ref="chart" :options="posOptions" :series="posSeries" height="300px" width="300px"></apexchart>
      </div>
      <div class="w-100"/>
      <div>
        <q-checkbox v-model="enoughLight" disable label="Jas"/>
        <br/>
        <q-checkbox v-model="strongWind" disable label="Silný vietor"/>
        <br/>
        <q-checkbox v-model="overHeated" disable label="Prehriate"/>
      </div>
    </div>
    <b>Nadchádzajúce natáčania pre dnešný deň</b>
    <table style="width: 100%; text-align: center">
      <tr>
        <th>Čas</th>
        <th>Typ posunu</th>
        <th>Vertikálne</th>
        <th>Horintálne</th>
      </tr>
      <tr v-for="item in remainingPositions" :key="item.hour+':'+item.minute">
        <td>{{ item.hour }}:{{ item.minute.toString().padStart(2, '0') }}</td>
        <td>{{ item.moveType }}</td>
        <td>{{ getVertMessage(item.vert) }}</td>
        <td>{{ getHorMessage(item.hor) }}</td>
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
      enoughLight: false,
      strongWind: false,
      overHeated: false,
      posSeries: [],
      west: false,
      east: false,
      north: false,
      south: false,
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
          max: 430,
          reversed: true,
        },
        xaxis: {
          type: 'number',
          show: false,
          min: -20,
          max: 710,
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
              x: 10,
              y: 215,
              marker: {size: 0},
              label: {text: "Západ"}
            }, {
              x: 650,
              y: 215,
              marker: {size: 0},
              label: {text: "Východ"}
            }, {
              x: 345,
              y: 0,
              marker: {size: 0},
              label: {text: "Sever"}
            }, {
              x: 345,
              y: 430,
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
    getHorMessage(val: number) {
      let message = "" + Math.abs(val);
      if (val === 0) return message;
      if (val < 0) {
        message += " bliknutí (Západ)"
      } else {
        message += " bliknutí (Východ)"
      }
      return message;
    },
    getVertMessage(val: number) {
      let message = "" + Math.abs(val);
      if (val === 0) return message;
      if (val < 0) {
        message += " bliknutí (Sever)"
      } else {
        message += " bliknutí (Juh)"
      }
      return message;
    },
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
            series['data'] = [[response.data['pos']['x'], response.data['pos']['y']]];
            this.posSeries.push(series);
            var movement: Array<String> = response.data['movement'];
            this.blinkIfNeeded(movement)
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            // eslint-disable-next-line
            console.log(error)
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
            if (data[0][0] !== response.data['pos']['x'] || data[0][1] !== response.data['pos']['y']) {
              data[0][0] = response.data['pos']['x'];
              data[0][1] = response.data['pos']['y'];
              let chart: any = this.$refs.chart;
              chart.refresh()
            }
            var movement: Array<String> = response.data['movement'];
            this.blinkIfNeeded(movement)
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          });
    },
    contains(movement: Array<String>, direction: string) {
      for (let i = 0; i++; movement.length) {
        if (movement[i] === direction) return true;
      }
      return false;
    },
    calculate(movement: Array<String>, direction: string, annotation: any, currentState: boolean, updater:Function) {
      var containsDirection = this.contains(movement, direction);
      if (currentState !== containsDirection) {
        updater(containsDirection);
        if (currentState) annotation.label.style.cssClass = 'blink';
        return true;
      }
      return false;
    },
    blinkIfNeeded(movement: Array<String>) {
      let chart: any = this.$refs.chart;

      let east = {
        id: 'east',
        x: 650,
        y: 215,
        marker: {size: 0},
        label: {text: "Východ", style: {cssClass: ''}}
      };
      let west = {
        id: 'west',
        x: 10,
        y: 215,
        marker: {size: 0},
        label: {text: "Západ", style: {cssClass: ''}}
      };
      let north = {
        id: 'north',
        x: 345,
        y: 0,
        marker: {size: 0},
        label: {text: "Sever", style: {cssClass: ''}}
      };
      let south = {
        id: 'south',
        x: 345,
        y: 430,
        marker: {size: 0},
        label: {text: "Juh", style: {cssClass: ''}}
      };
      if (this.calculate(movement, 'WEST', west, this.west,(val:boolean)=> this.west=val)) {
        chart.removeAnnotation(west.id);
        chart.addPointAnnotation(west, true)
      }
      if (this.calculate(movement, 'EAST', east, this.east,(val:boolean)=> this.east=val)) {
        chart.removeAnnotation(east.id);
        chart.addPointAnnotation(east, true)
      }
      if (this.calculate(movement, 'NORTH', north, this.north, (val:boolean)=> this.north=val)) {
        chart.removeAnnotation(north.id);
        chart.addPointAnnotation(north, true)
      }
      if (this.calculate(movement, 'SOUTH', south, this.south,(val:boolean)=> this.south=val)) {
        chart.removeAnnotation(south.id);
        chart.addPointAnnotation(south, true)
      }
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
<style>
.blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
