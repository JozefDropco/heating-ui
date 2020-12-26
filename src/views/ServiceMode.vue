<template>
    <div class="marginLeft5rem marginTop5rem">
        <q-toggle v-model="state" :label="$t('serviceModeState')"/>
        <div v-if="state">
            <br/>
            <br/>
            <q-card inline class="marginLeft5rem">
                <q-card-title>
                    {{$t('serviceModeInputs')}}
                </q-card-title>
                <q-card-separator/>
                <q-card-main>
                    <div v-for="(input,idx) in inputPins" :key="idx">
                        <q-toggle class="paddingBottom" v-model="input.value" disable="true"
                                  :label="input.name"/>
                    </div>
                </q-card-main>
            </q-card>
            <q-card inline class="marginLeft5rem">
                <q-card-title>
                    {{$t('serviceModeOutputs')}}
                </q-card-title>
                <q-card-separator/>
                <q-card-main>
                    <div v-for="(output,idx) in outputPins" :key="idx">
                        <q-toggle class="paddingBottom" v-model="output.value" @input="toggleOutputState(output)"
                                  :label="output.name"/>
                    </div>
                </q-card-main>
            </q-card>
            <q-btn class="marginLeft5rem"
                    round
                    icon="refresh"
                    color="primary"
                    @click="loadCurrentState"
            >
            </q-btn>
        </div>
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
                state: false,
                outputPins: [],
                inputPins: []
            }
        },
        methods: {
            loadCurrentState() {
                Loading.show();
                axios.get(cfg.BASE_URL + "serviceMode")
                    .then(response => {
                        this.state = response.data.state;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
                axios.get(cfg.BASE_URL + "port/outputs")
                    .then(response => {
                        this.outputPins.splice(0);
                        for (let i = 0; i < response.data.length; i++)
                            this.outputPins.push({
                                'refcd': response.data[i].refcd,
                                'name': response.data[i].name,
                                'value': response.data[i].value === 'true'
                            });
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
                axios.get(cfg.BASE_URL + "port/inputs")
                    .then(response => {
                        this.inputPins.splice(0);
                        for (let i = 0; i < response.data.length; i++)
                            this.inputPins.push({
                                'refcd': response.data[i].refcd,
                                'name': response.data[i].name,
                                'value': response.data[i].value === 'true'
                            });
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
            },
            handleStateChange() {
                Loading.show();
                axios.post(cfg.BASE_URL + "serviceMode?state=" + this.state)
                    .then(response => {
                        this.state = response.data.state;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
            },
            toggleOutputState(output: any) {
                Loading.show();
                axios.post(cfg.BASE_URL + "port/output/" + output.refcd, output.value, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        for (let i = 0; i < response.data.length; i++){
                          for (let j=0; j< this.outputPins.length; j++){
                             if (this.outputPins[j].refcd===response.data[i]) {
                               this.outputPins[i].value = false;
                             }
                          }
                        }
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
            }
        },
        watch: {
            state: function () {
                this.handleStateChange();
            }
        },
        mounted(): void {
            this.loadCurrentState();
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
