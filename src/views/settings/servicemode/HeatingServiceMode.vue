<template>
  <div class="marginLeft5rem marginTop5rem">
    <q-toggle v-model="state" :label="$t('serviceModeState')" @input="handleStateChange"/>
    <div>
      <br/>
      <br/>
      <q-card inline class="marginLeft5rem">
        <q-card-title>
          {{ $t('serviceModeInputs') }}
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <div v-for="(input,idx) in inputPins" :key="idx">
            <q-toggle class="paddingBottom" v-model="input.value" :disable="true">
              <a :href="input.url" target="_blank" v-if="input.url!=='#'">{{ input.name }}</a>
              <span v-if="input.url==='#'">{{input.name}}</span>
            </q-toggle>
          </div>
        </q-card-main>
      </q-card>
      <q-card inline class="marginLeft5rem">
        <q-card-title>
          {{ $t('serviceModeOutputs') }}
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <div v-for="(output,idx) in outputPins" :key="idx">
            <q-toggle class="paddingBottom" v-model="output.value" :disable="!state"
                      @input="toggleOutputState(output)">
              <a :href="output.url" target="_blank" v-if="output.url!=='#'">{{ output.name }}</a>
              <span v-if="output.url==='#'">{{output.name}}</span>
            </q-toggle>
          </div>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {Loading} from 'quasar';
import cfg from "../../../heating-config";
import axios from 'axios';

require('url-search-params-polyfill');
export default Vue.extend({
  data() {
    return {
      state: false,
      refreshIntervalId: null,
      outputPins: [],
      inputPins: [],
      active:false
    }
  },
  methods: {
    loadCurrentState() {
      axios.get(cfg.BASE_URL + "heating/serviceMode")
          .then(response => {
            this.state = response.data.state;
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          });
      axios.get(cfg.BASE_URL + "heating/port/outputs")
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              var found: boolean = false;
              for (let j = 0; j < this.outputPins.length; j++) {
                if (this.outputPins[j]['refcd'] === response.data[i].refcd) {
                  this.outputPins[j]['value'] = (response.data[i].value === 'true');
                  this.outputPins[j]['url'] = response.data[i].url;
                  found = true;
                }
              }
              if (!found) {
                this.outputPins.push({
                  'refcd': response.data[i].refcd,
                  'name': response.data[i].name,
                  'value': response.data[i].value === 'true',
                  'url': response.data[i].url
                });
              }
            }
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          });
      axios.get(cfg.BASE_URL + "heating/port/inputs")
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              var found: boolean = false;
              for (let j = 0; j < this.inputPins.length; j++) {
                if (this.inputPins[j]['refcd'] === response.data[i].refcd) {
                  this.inputPins[j]['value'] = (response.data[i].value === 'true');
                  this.inputPins[j]['url'] = response.data[i].url;
                  found = true;
                }
              }
              if (!found) {
                this.inputPins.push({
                  'refcd': response.data[i].refcd,
                  'name': response.data[i].name,
                  'value': response.data[i].value === 'true',
                  'url': response.data[i].url
                });
              }
            }
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          });
      if (this.active) setTimeout(this.loadCurrentState,1000)
    },
    handleStateChange(val:boolean) {
      Loading.show();
      this.state=val
      axios.post(cfg.BASE_URL + "heating/serviceMode?state=" + val)
          .then(response => {
            this.state = response.data.state;
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            // eslint-disable-next-line
            console.log(error)
          });
    },
    toggleOutputState(output: any) {
      Loading.show();
      axios.post(cfg.BASE_URL + "heating/port/output/" + output.refcd, output.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              for (let j = 0; j < this.outputPins.length; j++) {
                if (this.outputPins[j].refcd === response.data[i]) {
                  this.outputPins[j].value = false;
                }
              }
            }
            Loading.hide();
          })
          .catch(error => {
            Loading.hide();
            // eslint-disable-next-line
            console.log(error)
          });
    }
  },
  mounted(): void {
    this.active=true
    this.loadCurrentState();
  },
  beforeDestroy() {
    this.active=false
  }
})
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
