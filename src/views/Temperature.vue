<template>
  <div style="margin-top: 20px">

    <q-table color="primary" dense title="Meracie miesta"
             :selected.sync="selected"
             selection="single"
             row-key="refCd"
             :data="data" :columns="columns">
      <template slot="top-right" slot-scope="props">
        <q-btn
            icon="delete"
            :disable="selected.length===0"
            label="Vymazať"
            @click="deleteMeasurePlace"
        />
        <q-btn :disable="freeDeviceIds.length===0"
               icon="add"
               label="Pridať"
               @click="addPopupDisplayed = true"
        />
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td auto-width>
          <q-checkbox dense v-model="props.selected"/>
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
          <q-popup-edit v-model="props.row.name" ref="editName" title="Upraviť" buttons label-set="Uložiť"
                        label-cancel="Zavrieť" @save="(v,iv)=>editMeasureplace(props.row)">
            <q-input float-label="Pomenovanie" v-model="props.row.name"/>
          </q-popup-edit>
        </q-td>
        <q-td key="refCd" :props="props">{{ props.row.refCd }}</q-td>
        <q-td key="deviceId" :props="props">
          {{ props.row.deviceId }}
          <q-popup-edit v-model="props.row" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>editMeasureplace(props.row,)">
            <q-select stack-label="ID zariadenia" :options="freeDeviceIds" v-model="props.row.deviceId"/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
    <q-modal v-model="addPopupDisplayed">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Pridať meracie miesto
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <q-input stack-label="Meno" :value="name"/>
          <q-select stack-label="ID zariadenia" :options="freeDeviceIds" :value="name"/>
          <br/>
          <q-btn
              color="primary"
              v-close-overlay
              label="Uložiť"
              @click="saveMeasureplace()"
          />
          <q-btn
              color="primary"
              v-close-overlay
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
import cfg from "../heating-config";
import axios from 'axios';


export default Vue.extend({
  data() {
    return {
      name: "",
      refCd: "",
      deviceId: "",
      selected: [],
      freeDeviceIds: [],
      addPopupDisplayed: false,
      tempSeries: [],
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
          position: 'top'
        },
        tooltip: {
          x: {
            show: true,
            format: 'dd. MM. yyyy HH:mm'
          },
        }
      },
      fromDate: new Date(),
      toDate: new Date(),
      columns: [
        {
          name: 'name',
          label: 'Pomenovanie meracieho miesta',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'refCd',
          label: 'Unikátny kľúč',
          align: 'left',
          field: 'refCd',
          sortable: true
        }, {
          name: 'deviceId',
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
      axios.get(cfg.BASE_URL + "temp/measurePlace")
          .then(response => {
            this.data = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
      axios.get(cfg.BASE_URL + "temp/freeDeviceIds")
          .then(response => {
            this.freeDeviceIds = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    },
    saveMeasureplace() {
      let data: any = {};
      data['name'] = this.name;
      data['deviceId'] = this.deviceId;
      axios.post(cfg.BASE_URL + "temp/measurePlace", data, {method: "post"})
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            alert(error)
          });
    },
    editMeasureplace(row: any) {
      axios.put(cfg.BASE_URL + "temp/measurePlace/" + row.refCd, row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            alert(error)
          });
    },
    deleteMeasurePlace() {
      axios.delete(cfg.BASE_URL + "temp/measurePlace/" + this.selected[0].refCd)
          .then(response => {
            this.loadCurrentState();
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
