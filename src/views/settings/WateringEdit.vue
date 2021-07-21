<template>
    <div class="marginLeft5rem marginTop5rem">
        <q-checkbox v-model="active" :label="$t('wateringActive')"/>
        <q-input v-model="zoneRefCode" :stack-label="$t('wateringZoneRefCd')"/>
        <q-input v-model="name" :stack-label="$t('wateringName')"/>
        <q-input v-model="modulo" type="number" :stack-label="$t('wateringModulo')"/>
        <q-input v-model="reminder" type="number" :stack-label="$t('wateringReminder')"/>
        <q-input v-model="timeInSeconds" :stack-label="$t('wateringDuration')"/>
        <q-input v-model="time" :stack-label="$t('wateringTime')"/>
        <q-input v-model="retryTime" :stack-label="$t('wateringRetryTime')"/>
        <br/>
        <q-btn icon="save" :label="$t('save')" @click="saveWatering"/>
    </div>
</template>

<script lang="ts">
    import {Vue} from 'vue-property-decorator';
    import {date, Loading} from 'quasar';
    import cfg from "../../heating-config";
    import axios from 'axios';

    require('url-search-params-polyfill');

    let staticDate = new Date(2017, 2, 7, 0, 0, 0, 0);

    export default Vue.extend({
        data() {
            return {
                reminder: 0,
                modulo: 1,
                time: null,
                zoneRefCode: "",
                timeInSeconds: null,
                retryTime: null,
                active: true,
                name: ""
            }
        },
        computed: {},
        methods: {
            saveWatering: function () {
                Loading.show();
                var rec: any = {};
                rec.id = this.$route.params.wId;
                rec.name = this.name;
                rec.zoneRefCode = this.zoneRefCode;
                rec.active = this.active;
                rec.modulo = this.modulo;
                rec.reminder = this.reminder;
                rec.timeInSeconds = parseInt(this.timeInSeconds.split(":")[0])*60+parseInt(this.timeInSeconds.split(":")[1]);
                rec.hour = parseInt(this.time.split(":")[0]);
                rec.minute = parseInt(this.time.split(":")[1]);
                rec.retryHour = (this.retryTime === null ? null : parseInt(this.retryTime.split(":")[0]));
                rec.retryMinute = (this.retryTime === null ? null :  parseInt(this.retryTime.split(":")[1]));
                axios.put(cfg.BASE_URL + "watering/" + this.$route.params.wId, rec).then(response => {
                    Loading.hide();
                })
                    .catch(error => {
                        Loading.hide();
                        console.log(error)
                    });

            },
            loadCurrentState() {
                Loading.show();
                axios.get(cfg.BASE_URL + "watering/" + this.$route.params.wId)
                    .then(response => {
                        var rec = response.data;
                        this.name = rec.name;
                        this.zoneRefCode = rec.zoneRefCode;
                        this.timeInSeconds = rec.timeInSeconds;
                        this.active = rec.active;
                        this.modulo = rec.modulo;
                        this.reminder = rec.reminder;
                        this.timeInSeconds = date.formatDate(date.addToDate(staticDate, {seconds: rec.timeInSeconds}), 'mm:ss');
                        this.time = date.formatDate(date.addToDate(staticDate, {
                            hours: rec.hour,
                            minutes: rec.minute
                        }), 'HH:mm');
                        if (rec.retryHour !== undefined || rec.retryMinute !== undefined) {
                            if (rec.retryHour !== undefined) {
                                rec.retryHour = rec.hour;
                            }
                            if (rec.retryMinute !== undefined) {
                                rec.retryMinute = rec.minute;
                            }
                            this.retryTime = date.formatDate(date.addToDate(staticDate, {
                                hours: rec.retryHour,
                                minutes: rec.retryMinute
                            }), 'HH:mm');
                        }
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        console.log(error)
                    });
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
