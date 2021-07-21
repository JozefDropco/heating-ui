<template>
  <div class="marginLeft5rem marginTop5rem">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/" />
      <q-breadcrumbs-el label="Solár" to="/Solar" />
    </q-breadcrumbs>
    <br/>
    <q-select :options="monthsOptions" float-label="Mesiac" v-model="month" @input="loadCurrentState"/>
    <br/>
    <q-card class="q-ma-md" inline>
      <q-card-title>
        Ranná pozícia
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-datetime type="time" v-model="sunRiseTime" stack-label="Čas"  format24h/>
        <q-input stack-label="Horizontálne(S-J)" :value="schedule.sunRiseAbsHor" type="number"/>
        <q-input stack-label="Vertikálne (V-Z)" :value="schedule.sunRiseAbsVer" type="number"/>
      </q-card-main>
    </q-card>
    <q-card class="q-ma-md" inline>
      <q-card-title>
        Parkovacia pozícia
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-datetime type="time" v-model="sunSetTime" stack-label="Čas" format24h/>
        <q-input stack-label="Horizontálne(S-J)" :value="schedule.sunSetAbsHor" type="number"/>
        <q-input stack-label="Vertikálne (V-Z)" :value="schedule.sunSetAbsVer" type="number"/>
      </q-card-main>
    </q-card>
    <q-card class="q-ma-md" inline>
    <q-card-title>
      Veľkosť kroku
    </q-card-title>
    <q-card-separator/>
    <q-card-main>
      <q-input stack-label="Horizontálna veľkosť kroku" :value="schedule.horizontalStep" type="number"/>
      <q-input stack-label="Vertikálna veľkosť kroku" :value="schedule.verticalStep" type="number"/>
    </q-card-main>
  </q-card>
        <q-table
             selection="single"
             :selected.sync="rowSelected"
             :data="tableData"
             :pagination.sync="serverPagination"
             :columns="columns"
             :row-key="id"
    >
      <template slot="top-right" slot-scope="props">
<!--        <q-btn-->
<!--            icon="delete"-->
<!--            :disable="rowSelected.length===0"-->
<!--            label="Vymazať"-->
<!--            @click="deleteSolar"-->
<!--        />-->
<!--        <q-btn icon="add" label="Pridať" @click="addSolarEntry=true" disable/>-->
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td auto-width>
          <q-checkbox dense v-model="props.selected"/>
        </q-td>
        <q-td key="hour" :props="props">
          {{ props.row.hour }}
        </q-td>
        <q-td key="minute" :props="props">
          {{ props.row.minute }}
        </q-td>
        <q-td key="ignore" :props="props">
          <q-checkbox v-model="props.row.ignore" disable/>
          <q-popup-edit v-model="props.row.ignore" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>editSolar(props.row)">
            <q-checkbox v-model="props.row.ignore"/>
          </q-popup-edit>
        </q-td>
        <q-td key="hor" :props="props">
          {{ props.row.hor }}
          <q-popup-edit v-model="props.row.hor" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>editSolar(props.row)">
            <q-slider v-model="props.row.hor" :min="-135" :max="1" label-always/>
          </q-popup-edit>
        </q-td>
        <q-td key="vert" :props="props">
          {{ props.row.vert }}
          <q-popup-edit v-model="props.row.vert" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>editSolar(props.row)">
            <q-slider v-model="props.row.vert" :min="-280" :max="1" label-always/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../../heating-config";
import axios from 'axios';
import moment from "moment";

require('url-search-params-polyfill');

export default Vue.extend({
  data() {
    return {
      month: null,
      sunRiseTime : null,
      sunSetTime : null,
      serverPagination: {
        page: 1,
        rowsNumber: 50 // specifying this determines pagination is server-side
      },
      monthsOptions: [
        {
          label: 'Január',
          value: '1'
        },
        {
          label: 'Február',
          value: '2'
        },
        {
          label: 'Marec',
          value: '3'
        },
        {
          label: 'Apríl',
          value: '4'
        },
        {
          label: 'Máj',
          value: '5'
        },
        {
          label: 'Jún',
          value: '6'
        },
        {
          label: 'Júl',
          value: '7'
        },
        {
          label: 'August',
          value: '8'
        },
        {
          label: 'September',
          value: '9'
        },
        {
          label: 'Október',
          value: '10'
        },
        {
          label: 'November',
          value: '11'
        },
        {
          label: 'December',
          value: '12'
        }
      ],
      schedule:{},
      tableData: [],
      inputPins: [],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      },
      rowSelected: [],
      columns: [{
        name: 'hour',
        required: true,
        label: 'Hodina',
        align: 'left',
        field: 'hour',
        sortable: true,
      }, {
        name: 'minute',
        required: true,
        label: 'Minúta',
        align: 'left',
        field: 'minute',
        sortable: true,
      }, {
        name: 'hor',
        required: true,
        label: 'Horizontálne',
        align: 'left',
        field: 'hor',
        sortable: true,
      }, {
        name: 'vert',
        required: true,
        label: 'Vertikálne',
        align: 'left',
        field: 'vert',
        sortable: true,
      }]
    }
  },
  methods: {
    loadCurrentState() {
      Loading.show();
      let url = cfg.BASE_URL + "solar?month=" + this.month;
      axios.get(url)
          .then(response => {
            this.tableData = response.data.positions;
            for (let i = 0; i<this.tableData.length;i++){
              this.tableData[i].id = this.tableData[i].hour +":" +this.tableData[i].minute;
            }
            this.schedule = response.data;
            this.sunRiseTime = moment(response.data.sunRiseHour+':'+response.data.sunRiseMinute,'HH:mm');
            this.sunSetTime = moment(response.data.sunSetHour+':'+response.data.sunSetMinute,'HH:mm');
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    editSolar(row: any) {
      let url = cfg.BASE_URL + "solar/cmd/update?month=" + this.month;
      Loading.show();
      axios.put(url, row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    deleteSolar() {
      let url = cfg.BASE_URL + "solar/cmd/delete?month=" + this.month;
      Loading.show();
      axios.post(url, this.rowSelected, {method: "POST"})
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
    this.month = (moment().month()+1).toString();
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
