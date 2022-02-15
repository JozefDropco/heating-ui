<template>
  <div style="margin-top: 20px">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Domov" to="/" />
      <q-breadcrumbs-el label="Nastavenia" to="/?tabValue=settings"/>
      <q-breadcrumbs-el label="Teploty" to="/Temperature" />
    </q-breadcrumbs>
    <br/>
    <q-table color="primary" dense title="Meracie miesta"
             :selected.sync="selected"
             selection="single"
             row-key="refCd"
             :data="data" :columns="tempColumns">
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
          <q-popup-edit v-model="props.row.name" title="Upraviť" buttons label-set="Uložiť"
                        label-cancel="Zavrieť" @save="(v,iv)=>editMeasureplace(props.row)">
            <q-input float-label="Pomenovanie" v-model="props.row.name"/>
          </q-popup-edit>
        </q-td>
        <q-td key="refCd" :props="props">{{ props.row.refCd }}</q-td>
        <q-td key="orderId" :props="props">
          {{ props.row.orderId }}
          <q-popup-edit v-model="props.row.orderId" title="Upraviť" buttons label-set="Uložiť"
                        label-cancel="Zavrieť" @save="(v,iv)=>editMeasureplace(props.row)">
            <q-input float-label="Poradie" v-model="props.row.orderId" type="number"/>
          </q-popup-edit>
        </q-td>
        <q-td key="deviceId" :props="props">
          {{ props.row.deviceId }}
          <q-popup-edit v-model="props.row.deviceId" persistent title="Upraviť" buttons label-set="Uložiť" label-cancel="Zavrieť"
                        @save="(v,iv)=>editMeasureplace(props.row)">
            <q-select stack-label="ID zariadenia" :options="freeDeviceIds"   v-model="props.row.deviceId"/>
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
          <q-input stack-label="Meno" v-model="name"/>
          <q-input stack-label="Poradie" v-model="orderId"/>
          <q-select stack-label="ID zariadenia" :options="freeDeviceIds" v-model="deviceId"/>
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
import cfg from "../../heating-config";
import axios from 'axios';


export default Vue.extend({
  data() {
    return {
      name: "",
      refCd: "",
      orderId: 1,
      deviceId: "",
      selected: [],
      freeDeviceIds: [],
      addPopupDisplayed: false,
      tempSeries: [],
      fromDate: new Date(),
      toDate: new Date(),
      tempColumns: [
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
        },{
          name: 'orderId',
          label: 'Poradie',
          align: 'left',
          field: 'orderId',
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
            // eslint-disable-next-line
            console.log(error)
          });
      axios.get(cfg.BASE_URL + "temp/freeDeviceIds")
          .then(response => {
            var tmp:Array<any>=new Array<any>();
            for (var i=0; i< response.data.length;i++){
              tmp.push({"value":response.data[i],"label":response.data[i]});
            }
            this.freeDeviceIds = tmp;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            // eslint-disable-next-line
            console.log(error)
          });
    },
    saveMeasureplace() {
      let data: any = {};
      data['name'] = this.name;
      data['deviceId'] = this.deviceId;
      data['orderId'] = this.orderId;
      axios.post(cfg.BASE_URL + "temp/measurePlace", data, {method: "post"})
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          });
    },
    editMeasureplace(row: any) {
      axios.put(cfg.BASE_URL + "temp/measurePlace/" + row.refCd, row, {method: "PUT"})
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          });
    },
    deleteMeasurePlace() {
      axios.delete(cfg.BASE_URL + "temp/measurePlace/" + this.selected[0].refCd)
          .then(response => {
            this.loadCurrentState();
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
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
