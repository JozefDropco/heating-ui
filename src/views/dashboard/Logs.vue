<template>
  <div>
    <q-datetime v-model="date" float-label="Dátum" type="date" @change="loadCurrentState"
                :first-day-of-week="1"/>
    <q-select v-model="logLevel" stack-label="Stupeň podrobnosti" @input="loadCurrentState" :options="logLevels"/>
    <q-select v-model="numberOfLines" stack-label="Počet správ" @input="loadCurrentState"
              :options="numberOfLinesOptions"/>
    <br/>
    <table style="width: 100%; text-align: center; border: 1px solid gray; border-collapse: collapse">
      <tr>
        <th style="border: 1px solid gray; border-collapse: collapse" class="q-pa-md">Čas</th>
        <th  style="border: 1px solid gray; border-collapse: collapse" class="q-pa-md">Správa</th>
      </tr>
      <tr v-for="item in messages" :key="item.id">
        <td style="border: 1px solid gray; border-collapse: collapse">{{ item.hour }}:{{ item.minute }}</td>
        <td style="border: 1px solid gray; border-collapse: collapse" align="left"> {{ item.message }}</td>
      </tr>
    </table>
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
      date: new Date(),
      logLevel: "INFO",
      numberOfLines: "15",
      messages: [],
      logLevels: [
        {
          label: 'Informatívne',
          value: 'INFO'
        },
        {
          label: 'Chybové',
          value: 'SEVERE'
        },
        {
          label: 'Všetko',
          value: 'ALL'
        }
      ],
      numberOfLinesOptions: [
        {
          label: '15',
          value: "15"
        }, {
          label: '50',
          value: "50"
        },
        {
          label: '100',
          value: '100'
        },
        {
          label: '150',
          value: "150"
        }
      ],
      refreshIntervalId: null,
    }
  },
  methods: {
    loadCurrentState(initial: boolean) {
      var dateValue = this.date.toISOString().slice(0, 10);
      if (initial || dateValue === new Date().toISOString().slice(0, 10))
        axios.get(cfg.BASE_URL + "logs?date=" + dateValue + "&logLevel=" + this.logLevel + "&cnt=" + this.numberOfLines)
            .then(response => {
              this.messages = response.data;
              Loading.hide();
            })
            .catch(error => {
              Loading.hide();
              alert(error)
            });
    }
  },
  mounted(): void {
    this.loadCurrentState(true);
    this.refreshIntervalId = setInterval(this.loadCurrentState, 5000,false);
  },
  beforeDestroy() {
    clearInterval(this.refreshIntervalId);
  }
});
</script>
