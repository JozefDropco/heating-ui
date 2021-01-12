<template>
  <div class="q-pa-md">

    <q-table :pagination.sync="pagination"  title="Celé konštanty" :columns="columns" no-data-label="Žiadne konštanty" :data="longData">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="refCd" :props="props">{{ props.row.refCd }}</q-td>
        <q-td key="value" :props="props">
          {{ props.row.value }}
          <q-popup-edit v-model="props.row.value" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>modify(props.row,'long')">
            <q-input stack-label="Hodnota" v-model="props.row.value"/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
    <br/>
    <q-table :pagination.sync="pagination"  title="Desatinné konštanty" :columns="columns" no-data-label="Žiadne konštanty" :data="doubleData">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="refCd" :props="props">{{ props.row.refCd }}</q-td>
        <q-td key="value" :props="props">
          {{ props.row.value }}
          <q-popup-edit v-model="props.row.value" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>modify(props.row,'double')">
            <q-input stack-label="Hodnota" v-model="props.row.value"/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
    <br/>
    <q-table :pagination.sync="pagination" title="Textové konštanty" :columns="columns" no-data-label="Žiadne konštanty" :data="stringData">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="refCd" :props="props">{{ props.row.refCd }}</q-td>
        <q-td key="value" :props="props">
          {{ props.row.value }}
          <q-popup-edit v-model="props.row.value" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>modify(props.row,'string')">
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
      stringData:[],
      longData:[],
      doubleData:[],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 50 // current rows per page being displayed
      },
      columns: [
        {
          name: 'refCd',
          label: 'Kľúč',
          align: 'left',
          field: 'refCd',
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
            this.longData= response.data['longConsts'];
            this.doubleData= response.data['doubleConsts'];
            this.stringData= response.data['stringConsts'];
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    },
    modify(row:any,type:string){
      axios.put(cfg.BASE_URL + "const?type=" + type, row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            alert(error)
          });
    }
  },
  mounted(): void {
    this.loadCurrentState();
    this.refreshIntervalId = setInterval(this.loadCurrentState, 5000);
  },
  beforeDestroy() {
    clearInterval(this.refreshIntervalId);
  }
});
</script>
