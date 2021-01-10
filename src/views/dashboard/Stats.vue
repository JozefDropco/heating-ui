<template>
  <div>
    <q-select float-label="Zobraziť pre" :options="selectOptions" v-model="option" @input="switchOption"/>
    <q-datetime v-if="option==='day'" v-model="date" float-label="Dátum" type="date" @change="changeDay"
                :first-day-of-week="1"/>
    <q-select v-if="option!=='day'" v-model="year" stack-label="Rok" @input="changeYear" :options="years"/>
    <q-select v-if="option==='week'" v-model="week" stack-label="Týždeň" @input="changeWeek" :options="weeks"/>
    <q-select v-if="option==='month'" v-model="month" stack-label="Mesiac" @input="changeMonth" :options="months"/>

    <br/>
    <q-checkbox label="Manuálne" v-model="manual"/>
    <q-datetime v-if="manual" v-model="fromDate" float-label="Od dátumu" type="date" @change="loadCurrentState"
                :first-day-of-week="1"/>
    <q-datetime v-if="manual" v-model="toDate" float-label="Do dátumu" type="date" @change="loadCurrentState"
                :first-day-of-week="1"/>
    <br/>
    <q-table title="Teploty" :columns="tempColumns" no-data-label="Teploty neboli namerané" :data="tempData"/>
    <q-table title="Vstup/Výstup" :columns="portColumns" no-data-label="Žiadne štatistiky" :data="portsData"/>
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
      month: moment().month().toString(),
      year: new Date().getFullYear().toString(),
      week: moment().week().toString(),
      date: new Date(),
      manual: false,
      fromDate: new Date(),
      toDate: new Date(),
      selectOptions: [
        {
          label: 'Deň',
          value: 'day'
        },
        {
          label: 'Týždeň',
          value: 'week'
        },
        {
          label: 'Mesiac',
          value: 'month'
        },
        {
          label: 'Rok',
          value: 'year'
        }
      ],
      months: [
        {
          label: 'Január',
          value: "0"
        },
        {
          label: 'Február',
          value: "1"
        },
        {
          label: 'Marec',
          value: "2"
        },
        {
          label: 'Apríl',
          value: "3"
        },
        {
          label: 'Máj',
          value: "4"
        },
        {
          label: 'Jún',
          value: "5"
        },
        {
          label: 'Júl',
          value: "6"
        },
        {
          label: 'August',
          value: "7"
        },
        {
          label: 'September',
          value: "8"
        },
        {
          label: 'Október',
          value: "9"
        },
        {
          label: 'November',
          value: "10"
        },
        {
          label: 'December',
          value: "11"
        }
      ],
      option: "day",
      tempData: [],
      portsData: [],
      years: [],
      tempColumns: [
        {
          name: 'measurePlace',
          label: 'Meracie miesto',
          align: 'left',
          field: 'measurePlace',
          sortable: true,
        }, {
          name: 'min',
          label: 'Minimum',
          align: 'right',
          field: 'min',
          sortable: true,
        }, {
          name: 'max',
          label: 'Maximum',
          align: 'right',
          field: 'max',
          sortable: true,
        }, {
          name: 'avg',
          label: 'Priemer',
          align: 'right',
          field: 'avg',
          sortable: true,
        },
      ],
      portColumns: [
        {
          name: 'name',
          label: 'Meno',
          align: 'left',
          field: 'name',
          sortable: true,
        }, {
          name: 'secondsSum',
          label: 'Čas',
          align: 'right',
          field: 'secondsSum',
          sortable: true,
          format: (secs:any) => {
            var minutes = Math.floor(secs / 60);
            secs = secs % 60;
            var hours = Math.floor(minutes / 60)
            minutes = minutes % 60;
            return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + secs).slice(-2)}`;
          }
        }, {
          name: 'count',
          label: 'Počet',
          align: 'right',
          field: 'count',
          sortable: true,
        }
      ],
      weeks: []
    }
  },
  methods: {
    changeDay() {
      this.fromDate = this.date;
      this.toDate = this.date;
      this.loadCurrentState();
    },
    changeYear() {
      if (this.option === 'week') {
        this.changeWeek();
      }
      if (this.option === 'month') {
        this.changeMonth();
      }
      if (this.option === 'year') {
        this.fromDate = moment().set('year', parseInt(this.year)).startOf('year').toDate();
        this.toDate = moment().set('year', parseInt(this.year)).endOf('year').toDate();
        this.loadCurrentState();
      }
    },
    changeWeek() {
      this.fromDate = moment().set('year', parseInt(this.year)).set('isoWeek', parseInt(this.week)).startOf('isoWeek').toDate();
      this.toDate = moment().set('year', parseInt(this.year)).set('isoWeek', parseInt(this.week)).endOf('isoWeek').toDate();
      this.loadCurrentState();
    },
    changeMonth() {
      this.fromDate = moment().set('year', parseInt(this.year)).set('month', parseInt(this.month)).startOf('month').toDate();
      this.toDate = moment().set('year', parseInt(this.year)).set('month', parseInt(this.month)).endOf('month').toDate();
      this.loadCurrentState();
    },
    switchOption() {
      if (this.option === 'day') {
        this.fromDate = new Date();
        this.toDate = new Date();
      }
      if (this.option === 'week') {
        this.fromDate = moment().startOf('isoWeek').toDate();
        this.toDate = moment().endOf('isoWeek').toDate();
      }
      if (this.option === 'month') {
        this.fromDate = moment().startOf('month').toDate();
        this.toDate = moment().endOf('month').toDate();
      }
      if (this.option === 'year') {
        this.fromDate = moment().startOf('year').toDate();
        this.toDate = moment().endOf('year').toDate();
      }
      this.loadCurrentState();
    },
    loadCurrentState() {
      var fromValue = this.fromDate.toISOString().slice(0, 10);
      var toValue = this.toDate.toISOString().slice(0, 10);
      axios.get(cfg.BASE_URL + "stats/temp?toDate=" + toValue + "&fromDate=" + fromValue)
          .then(response => {
            this.tempData = response.data['temps'];
            this.portsData = response.data['ports'];
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            alert(error)
          });
    }
  },
  mounted(): void {
    let year = new Date().getFullYear();
    for (var i = 0; i < 5; i++) {
      this.years.push({
        "label": (year - i).toString(),
        "value": (year - i).toString()
      });
    }
    for (i = 1; i <= 53; i++) {
      this.weeks.push({
        "label": i.toString(),
        "value": i.toString()
      });
    }
    this.loadCurrentState();
  }
});
</script>
