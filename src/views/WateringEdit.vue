<template>
    <div class="marginLeft5rem marginTop5rem">
        <q-checkbox v-model="active" :label="$t('wateringActive')" />
        <q-input v-model="zoneRefCode" :stack-label="$t('wateringZoneRefCd')" />
        <q-input v-model="name" :stack-label="$t('wateringName')" />
        <q-input v-model="modulo" type="number" :stack-label="$t('wateringModulo')" />
        <q-input v-model="reminder" type="number" :stack-label="$t('wateringReminder')" />
        <q-input v-model="timeInSeconds" type="time" :stack-label="$t('wateringDuration')" />
        <q-input v-model="time" type="time" :stack-label="$t('wateringTime')"/>
        <q-input v-model="retryTime" type="time" :stack-label="$t('wateringRetryTime')"/>
        <br/>
        <q-btn icon="save" :label="$t('save')" @click="saveWatering"/>
    </div>
</template>

<script lang="ts">
    import {Vue} from 'vue-property-decorator';
    import {Loading} from 'quasar';
    import cfg from "../heating-config";
    import axios from 'axios';
    import i18n from "../I18n";

    require('url-search-params-polyfill');

    export default Vue.extend({
        data() {
            return {
                reminder:0,
                modulo:1,
                time:null,
                zoneRefCode:"",
                timeInSeconds:null,
                retryTime:null,
                active:true,
                name:""
        }
        },
        computed: {
        },
        methods: {
            saveWatering: function () {
                Loading.show();
                axios.get(cfg.BASE_URL + "watering/" + this.$route.params.wId)
                    .then(response => {
                        var rec:any = {};
                        rec.name = this.name;
                        rec.zoneRefCode = this.zoneRefCode;
                        rec.timeInSeconds = this.timeInSeconds;
                        rec.active = this.active;
                        rec.modulo = this.modulo;
                        rec.reminder = this.reminder;
                        var rem = rec.timeInSeconds;
                        var seconds = rem % 60;
                        rem -= seconds;
                        rem = rem / 60;
                        if (rem === 0) return seconds + 's';
                        var minutes = rem % (60);
                        rem -= minutes;
                        rem = rem / 60;
                        this.timeInSeconds = rem.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
                        this.time = rec.hour.toString().padStart(2, '0') + ":" + rec.minute.toString().padStart(2, '0');
                        if (rec.retryHour !== undefined)
                            if (rec.retryMinute !== undefined) {
                                this.retryTime = rec.retryHour.toString().padStart(2, '0') + ':' + rec.retryMinute.toString().padStart(2, '0');
                            } else {
                                this.retryTime = rec.retryHour.toString().padStart(2, '0') + ':' + rec.minute.toString().padStart(2, '0');
                            }
                        else if (rec.retryMinute !== undefined) {
                            this.retryTime = rec.hour.toString().padStart(2, '0') + ':' + rec.retryMinute.toString().padStart(2, '0');
                        } else this.retryTime = null;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });

            },
            loadCurrentState() {
                Loading.show();
                axios.get(cfg.BASE_URL + "watering/"+this.$route.params.wId)
                    .then(response => {
                        var rec = response.data;
                        this.name  =rec.name;
                        this.zoneRefCode = rec.zoneRefCode;
                        this.timeInSeconds = rec.timeInSeconds;
                        this.active = rec.active;
                        this.modulo = rec.modulo;
                        this.reminder = rec.reminder;
                        var rem = rec.timeInSeconds;
                        var seconds = rem % 60;
                        rem -= seconds;
                        rem = rem / 60;
                        if (rem === 0) return seconds + 's';
                        var minutes = rem % (60);
                        rem -= minutes;
                        rem = rem / 60;
                        this.timeInSeconds = rem.toString().padStart(2, '0')+':'+minutes.toString().padStart(2, '0')+':'+seconds.toString().padStart(2, '0');
                        this.time = rec.hour.toString().padStart(2, '0') +":"+rec.minute.toString().padStart(2, '0');
                        if (rec.retryHour !== undefined)
                            if (rec.retryMinute !== undefined) {
                                this.retryTime=rec.retryHour.toString().padStart(2, '0') + ':' + rec.retryMinute.toString().padStart(2, '0');
                            } else {
                                this.retryTime=rec.retryHour.toString().padStart(2, '0') + ':' + rec.minute.toString().padStart(2, '0');
                            }
                        else if (rec.retryMinute !== undefined) {
                            this.retryTime=rec.hour.toString().padStart(2, '0') + ':' + rec.retryMinute.toString().padStart(2, '0');
                        } else this.retryTime=null;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
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