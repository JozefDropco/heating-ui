<template>
  <div class="marginLeft5rem marginTop5rem">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/"/>
      <q-breadcrumbs-el label="Heating" to="/Heating"/>
    </q-breadcrumbs>
    <br/>
    <q-card inline>
      <q-card-title>Solár a ohrev vody</q-card-title>
      <q-card-main>

        <q-select :options="selectOptions" float-label="Upraviť pre" v-model="modifyFor" @input="loadCurrentState"/>
        <q-table v-if="modifyFor!==null"
                 selection="single"
                 :selected.sync="rowSelected"
                 :data="tableData"
                 :pagination.sync="serverPagination"
                 :columns="columns"
                 row-key="id"
        >
          <template slot="top-right" slot-scope="props">
            <q-btn
                icon="delete"
                :disable="rowSelected.length===0"
                label="Vymazať"
                @click="deleteHeating"
            />
            <q-btn icon="add" label="Pridať" @click="addHeating=true"/>
          </template>
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td auto-width>
              <q-checkbox dense v-model="props.selected"/>
            </q-td>
            <q-td key="fromTime" :props="props">
              {{ formatTime(props.row.fromTime)}}
                        <q-popup-edit v-model="props.row.fromTime" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                                      @save="(v,iv)=>editHeating(props.row)">
                          <q-datetime-picker type="time" v-model="props.row.fromTime"  format24h/>
                        </q-popup-edit>
            </q-td>
            <q-td key="toTime" :props="props">
              {{ formatTime(props.row.toTime) }}
                        <q-popup-edit v-model="props.row.toTime" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                                      @save="(v,iv)=>editHeating(props.row)">
                          <q-datetime-picker type="time" v-model="props.row.toTime" format24h/>
                        </q-popup-edit>
            </q-td>
            <q-td key="threeWayValveStartDiff" :props="props">
              {{ props.row.threeWayValveStartDiff }}
              <q-popup-edit v-model="props.row.threeWayValveStartDiff" title="Upraviť" buttons label-set="Uložiť"
                            label-cancel="Zavrieť"
                            @save="(v,iv)=>editHeating(props.row)">
                <q-input type="number" v-model="props.row.threeWayValveStartDiff"/>
              </q-popup-edit>
            </q-td>
            <q-td key="threeWayValveStopDiff" :props="props">
              {{ props.row.threeWayValveStopDiff }}
              <q-popup-edit v-model="props.row.threeWayValveStopDiff" title="Upraviť" buttons label-set="Uložiť"
                            label-cancel="Zavrieť"
                            @save="(v,iv)=>editHeating(props.row)">
                <q-input type="number" v-model="props.row.threeWayValveStopDiff"/>
              </q-popup-edit>
            </q-td>
            <q-td key="boilerBlock" :props="props">
              <q-checkbox v-model="props.row.boilerBlock" disable/>
              <q-popup-edit v-model="props.row.boilerBlock" title="Upraviť" buttons label-set="Uložiť"
                            label-cancel="Zavrieť"
                            @save="(v,iv)=>editSolar(props.row)">
                <q-checkbox v-model="props.row.boilerBlock" label-always/>
              </q-popup-edit>
            </q-td>
          </q-tr>
        </q-table>
      </q-card-main>
    </q-card>

    <q-modal v-model="addHeating">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Pridať
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <q-datetime type="time" format24h input stack-label="Od" v-model="fromTime"/>
          <q-datetime type="time" format24h input stack-label="Do" v-model="toTime"/>
          <q-input type="number" float-label="Zapnúť ohrev pri"  v-model="diffStart"/>
          <q-input type="number" float-label="Zapnúť Bypass pri"  v-model="diffStop"/>
          <q-checkbox  label="Blokovať ohrev kotlom"  v-model="boilerBlocked"/>
          <br/>
          <q-btn
              color="primary"
              v-close-overlay
              label="Uložiť"
              @click="saveSolarHeating()"
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
import cfg from "../../heating-config";
import axios from 'axios';
import moment from 'moment';

require('url-search-params-polyfill');

export default Vue.extend({
  data() {
    return {
      addHeating:false,
      fromTime:null,
      toTime:null,
      diffStart:10,
      diffStop:0,
      boilerBlocked:false,
      modifyFor: moment().isoWeekday().toString(),
      serverPagination: {
        page: 1,
        rowsNumber: 50 // specifying this determines pagination is server-side
      },
      selectOptions: [
        {
          label: 'Pondelok',
          value: '1'
        },
        {
          label: 'Utorok',
          value: '2'
        },
        {
          label: 'Streda',
          value: '3'
        },
        {
          label: 'Štvrtok',
          value: '4'
        },
        {
          label: 'Piatok',
          value: '5'
        },
        {
          label: 'Sobota',
          value: '6'
        },
        {
          label: 'Nedeľa',
          value: '7'
        }
      ],
      columns: [{
        name: 'fromTime',
        required: true,
        label: 'Od (čas)',
        align: 'left',
        field: 'fromTime',
        sortable: true,
      }, {
        name: 'toTime',
        required: true,
        label: 'Do (čas)',
        align: 'left',
        field: 'toTime',
        sortable: true,
      }, {
        name: 'threeWayValveStartDiff',
        required: true,
        label: 'Otvoriť 3-cestný ventil pri differencii',
        align: 'threeWayValveStartDiff',
        field: 'hor',
        sortable: true,
      }, {
        name: 'threeWayValveStopDiff',
        required: true,
        label: 'Zatvoriť 3-cestný ventil pri differencii',
        align: 'left',
        field: 'threeWayValveStopDiff',
        sortable: true,
      }, {
        name: 'boilerBlock',
        required: true,
        label: 'Ohrev teplej vody blokovaný',
        align: 'left',
        field: 'boilerBlock',
        sortable: true,
      }],
      rowSelected: [],
      tableData: [],
    }
  },
  methods: {
    formatTime(time:string){
      return moment(time).format('HH:mm:ss');
    },
    loadCurrentState() {
      Loading.show();
      let url = cfg.BASE_URL + "heating/query/forDay/" + this.modifyFor;
      axios.get(url)
          .then(response => {
            this.tableData = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    editHeating(row: any) {
      axios.put(cfg.BASE_URL + "heating/cmd/update/" + row['id'], row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    saveSolarHeating(){
      Loading.show();
      var newItem  ={
        'fromTime':this.fromTime,
        'day':this.modifyFor,
        'toTime':this.toTime,
        'boilerBlock':this.boilerBlocked,
        threeWayValveStartDiff:this.diffStart,
        threeWayValveStopDiff:this.diffStop
      };
      axios.post(cfg.BASE_URL + "heating/cmd/create",newItem, {method: "POST"})
          .then(response => {
            this.loadCurrentState();
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },

    deleteHeating() {
      Loading.show();
      axios.delete(cfg.BASE_URL + "heating/cmd/delete/" + this.rowSelected[0]['id'], {method: "DELETE"})
          .then(response => {
            this.loadCurrentState();
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
