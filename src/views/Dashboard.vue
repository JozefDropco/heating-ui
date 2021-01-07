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
            <q-checkbox :value="false" disable label="Natáčanie"/>
            <br/>
            <div>Smer natáčania ak sa natáča S/J/V/Z</div>
          </div>
        </div>
      </q-card-main>
    </q-card>
    <q-card class="q-ma-md" inline>
      <q-card-title>
        Zavlažovanie
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        Stav zavlažovania za dnesny den, dazdovy senzor, spatna vazba od zavlazoania
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
          Bolo nebolo, ale ked raz bude tak zobrazime statistiky za dane obdobie (den, tento mesiac, minule mesiace, roky)
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
