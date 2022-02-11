<template>
  <div class="q-pa-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/"/>
      <q-breadcrumbs-el label="Nastavenia" to="/?tabValue=settings"/>
      <q-breadcrumbs-el label="Konštanty" to="/Constants"/>
    </q-breadcrumbs>
    <br/>
    <q-table dense :pagination.sync="pagination"  title="Konštanty" :columns="columns" no-data-label="Žiadne konštanty" :data="constData">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="group" :props="props">{{ props.row.group }}
          <q-popup-edit v-model="props.row.group" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>modify(props.row)">
            <q-input stack-label="Skupina" v-model="props.row.group"/>
          </q-popup-edit>
        </q-td>
        <q-td key="refCd" :props="props">{{ props.row.refCd }} </q-td>
        <q-td key="description" :props="props">{{ props.row.description }}
          <q-popup-edit v-model="props.row.description" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>modify(props.row)">
            <q-input stack-label="Popis" v-model="props.row.description"/>
          </q-popup-edit>
        </q-td>
        <q-td key="value" :props="props">
          {{ props.row.value }}
          <q-popup-edit v-model="props.row.value" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>modify(props.row)">
            <q-input float-label="Typ hodnoty" v-model="props.row.valueType"/>
            <q-input stack-label="Hodnota" v-model="props.row.value"/>
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
import moment from 'moment';

export default Vue.extend({
  data() {
    return {
      constData:[],
      pagination: {
        sortBy: "group", // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 50 // current rows per page being displayed
      },
      columns: [
        {
          name: 'group',
          label: 'Skupina',
          align: 'left',
          field: 'group',
          sortable: true,
        },
        {
          name: 'refCd',
          label: 'Kľúč',
          align: 'left',
          field: 'refCd',
          sortable: true,
        },{
          name: 'description',
          label: 'Popis',
          align: 'left',
          field: 'description',
          sortable: true,
        }, {
          name: 'value',
          label: 'Hodnota',
          align: 'left',
          field: 'value',
          sortable: true,
        }
      ],
      refreshIntervalId: null,
    }
  },
  methods: {
    loadCurrentState() {
      axios.get(cfg.BASE_URL + "const")
          .then(response => {
            this.constData= response.data;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            console.log(error)
          });
    },
    modify(row:any){
      axios.put(cfg.BASE_URL + "const?type=" + row['constantType'], row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            console.log(error)
          });
    }
  },
  mounted(): void {
    this.loadCurrentState();
  }
});
</script>
