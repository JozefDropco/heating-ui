<template>
  <div class="marginLeft5rem marginTop5rem">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/"/>
      <q-breadcrumbs-el label="Nastavenia" to="/?tabValue=settings"/>
      <q-breadcrumbs-el label="Solár" to="/Solar"/>
    </q-breadcrumbs>
    <br/>
    <q-select :options="monthsOptions" float-label="Mesiac" v-model="month" @input="loadCurrentState"/>
    <br/>
    <div>
      <span style="float: right; margin-right: 20px">
        <q-btn icon="save" label="Uložiť" @click="submitChange" color="primary"/>
      </span>
    </div>
    <q-card class="q-ma-md" inline>
      <q-card-title>
        Ranná pozícia
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-datetime type="time" v-model="sunRiseTime" stack-label="Čas" format24h/>
      </q-card-main>
    </q-card>
    <q-card class="q-ma-md" inline>
      <q-card-title>
        Parkovacia pozícia
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-datetime type="time" v-model="sunSetTime" stack-label="Čas" format24h/>
      </q-card-main>
    </q-card>
    <q-card class="q-ma-md" inline>
      <q-card-title>
        Veľkosť kroku
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-input stack-label="Horizontálna veľkosť kroku" :value="schedule.horizontalStep" type="number"
                 @input="val => { schedule.horizontalStep = val; }"/>
        <q-input stack-label="Vertikálna veľkosť kroku" :value="schedule.verticalStep" type="number"
                 @input="val => { schedule.verticalStep = val; }"/>
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
        <q-btn
            icon="delete"
            :disable="rowSelected.length===0"
            label="Vymazať"
            @click="deleteSolar"
        />
        <q-btn icon="add" label="Pridať" @click="addSolarEntry=true"/>
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td auto-width>
          <q-checkbox dense v-model="props.selected"/>
        </q-td>
        <q-td key="hour" :props="props">
          {{ props.row.hour }}
          <q-popup-edit v-model="props.row.hour" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť">
            <q-slider v-model="props.row.hour" :min="0" :max="23" label-always/>
          </q-popup-edit>
        </q-td>
        <q-td key="minute" :props="props">
          {{ props.row.minute }}
          <q-popup-edit v-model="props.row.minute" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť">
            <q-slider v-model="props.row.minute" :min="0" :max="59" label-always/>
          </q-popup-edit>
        </q-td>
        <q-td key="hor" :props="props">
          {{ props.row.hor }}
          <q-popup-edit v-model="props.row.hor" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť">
            <q-slider v-model="props.row.hor" :min="-10" :max="10" label-always/>
          </q-popup-edit>
        </q-td>
        <q-td key="vert" :props="props">
          {{ props.row.vert }}
          <q-popup-edit v-model="props.row.vert" title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť">
            <q-slider v-model="props.row.vert" :min="-10" :max="10" label-always/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
    <q-modal v-model="addSolarEntry">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Pridať
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <q-field label="Hodina">
            <q-slider type="number" label-always v-model="hour" :min="0" :max="23"/>
          </q-field>
          <q-field label="Minúta">
            <q-slider type="number" label-always  v-model="minute" :min="0" :max="59"/>
          </q-field>
          <q-field label="Horizontálne">
            <q-slider type="number" label-always  v-model="horizontal" :min="-10" :max="10"/>
          </q-field>
          <q-field label="Vertikálne">
            <q-slider type="number" label-always  v-model="vertical" :min="-10" :max="10"/>
          </q-field>
          <br/>
          <q-btn
              color="primary"
              v-close-overlay
              label="Uložiť"
              @click="saveSolarHeating()"
          />
          <q-btn
              color="primary"
              v-close-overlay @click="addSolarEntry=false"
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
import moment from "moment";

require('url-search-params-polyfill');

export default Vue.extend({
  data() {
    return {
      addSolarEntry: false,
      hour: 10,
      minute: 0,
      horizontal: 0,
      vertical: 0,
      month: null,
      sunRiseTime: moment().toDate(),
      sunSetTime: moment().toDate(),
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
      schedule: {
        horizontalStep: undefined,
        verticalStep: undefined,
        positions: undefined,
        sunRiseMinute: undefined,
        sunRiseHour: undefined,
        sunSetHour: undefined,
        sunSetMinute: undefined
      },
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
            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].id = this.tableData[i].hour + ":" + this.tableData[i].minute;
            }
            this.schedule = response.data;
            this.sunRiseTime = moment(response.data.sunRiseHour + ':' + response.data.sunRiseMinute, 'HH:mm').toDate();
            this.sunSetTime = moment(response.data.sunSetHour + ':' + response.data.sunSetMinute, 'HH:mm').toDate();
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    saveSolarHeating() {
      let positions: [any] = this.schedule.positions;
      let entry: any = {};
      entry.hour = this.hour;
      entry.minute = this.minute;
      entry.hor = this.horizontal;
      entry.vert = this.vertical;
      entry.moveType="Relatívna";
      positions.push(entry);
    },
    deleteSolar() {
      let positions: [] = this.schedule.positions;
      positions.splice(positions.findIndex(value => value === this.rowSelected[0]), 1);
      this.submitChange();
    },
    submitChange() {
      this.schedule.sunRiseHour = moment(this.sunRiseTime).hour();
      this.schedule.sunRiseMinute = moment(this.sunRiseTime).minutes();
      this.schedule.sunSetHour = moment(this.sunSetTime).hour();
      this.schedule.sunSetMinute = moment(this.sunSetTime).minutes();
      let url = cfg.BASE_URL + "solar/cmd/update?month=" + this.month;
      Loading.show();
      axios.post(url, this.schedule, {method: "POST"})
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
    this.month = (moment().month() + 1).toString();
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
