<template>
  <div class="marginLeft5rem marginTop5rem">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/" />
      <q-breadcrumbs-el label="Solár" to="/Solar" />
    </q-breadcrumbs>
    <br/>
    <q-select :options="selectOptions" float-label="Upraviť pre" v-model="modifyFor"/>
    <q-select :options="monthsOptions" float-label="Mesiac" v-model="month" v-if="modifyFor==='month'"
              @input="loadCurrentState"/>
    <q-datetime float-label="Dátum" v-model="date" type="date" v-if="modifyFor==='day'" @change="loadCurrentState"/>
    <br/>
    <q-table v-if="modifyFor==='day' || (modifyFor==='month' && month !==null)"
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
            @click="deleteSolar"
        />
        <q-btn icon="add" label="Pridať" @click="addSolarEntry=true" disable/>
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
import cfg from "../heating-config";
import axios from 'axios';

require('url-search-params-polyfill');

export default Vue.extend({
  data() {
    return {
      modifyFor: null,
      month: null,
      date: null,
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
      selectOptions: [
        {
          label: 'Celý mesiac',
          value: 'month'
        },
        {
          label: 'Deň',
          value: 'day'
        }
      ],
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
        name: 'ignore',
        required: true,
        label: 'Ignorovať jas',
        align: 'left',
        field: 'ignore',
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
      let url = cfg.BASE_URL + "solar";
      if (this.modifyFor === 'day' && this.date !== null)
        url = url + '?date=' + this.date.slice(0, 10);
      else
        url = url + '?month=' + this.month;
      axios.get(url)
          .then(response => {
            this.tableData = response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    },
    editSolar(row: any) {
      let url = cfg.BASE_URL + "solar/cmd/update";
      if (this.modifyFor === 'day' && this.date !== null)
        url = url + '?date=' + this.date.slice(0, 10);
      else
        url = url + '?month=' + this.month;
      Loading.show();
      axios.put(url, row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    },
    deleteSolar() {
      let url = cfg.BASE_URL + "solar/cmd/delete";
      if (this.modifyFor === 'day' && this.date !== null)
        url = url + '?date=' + this.date.slice(0, 10);
      else
        url = url + '?month=' + this.month;
      Loading.show();
      axios.post(url, this.rowSelected, {method: "POST"})
          .then(response => {
            this.loadCurrentState();
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    }
  },
  mounted(): void {
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
