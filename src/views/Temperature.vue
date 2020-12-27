<template>
  <div>
    <div class="marginLeft5rem marginTop5rem">
      <apexchart width="800" height="500" type="line" :options="options" :series="series"></apexchart>
    </div>
    <div class="row">
      <div class="col-12 q-pl-lg q-pb-lg">
        <q-table ref="table" color="primary" dense title="Meracie miesta"
                 :data="data" :columns="columns">
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../heating-config";
import axios from 'axios';

require('url-search-params-polyfill');

export default Vue.extend({
  data() {
    return {
      series: [],
      options: {
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
          position: 'left'
        },
        tooltip: {
          x: {
            show: true,
            format: 'dd. MM. yyyy HH:mm'
          },
        }
      },
      columns: [
        {
          name: 'Meno',
          required: true,
          label: 'Pomenovanie meracieho miesta',
          align: 'left',
          field: 'name',
          sortable: true
        }, {
          name: 'REF_CD',
          required: true,
          label: 'Unikátny kľúč',
          align: 'left',
          field: 'refCd',
          sortable: true
        }, {
          name: 'Číslo zariadenia',
          required: true,
          label: 'ID zariadenia',
          align: 'left',
          field: 'deviceId',
          sortable: true
        }
      ],
      data: []
    }
  },
  methods: {
    loadCurrentState() {
      Loading.show();
      axios.get(cfg.BASE_URL + "temp")
          .then(response => {
            this.series = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          })
      axios.get(cfg.BASE_URL + "temp/measurePlace")
          .then(response => {
            this.data = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    }
  },
  mounted(): void {
    this.loadCurrentState();
  }
});
</script>
<style>
.heading {
  font-size: large;
  font-weight: bold;
}

.marginLeft5rem {
  margin-left: 0.5rem;
}

.marginTop5rem {
  margin-top: 0.5rem;
}

.paddingBottom {
  padding-bottom: 0.5rem;
}

.window {
  padding: 1rem 2rem;
}
</style>
