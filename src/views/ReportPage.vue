<template>
    <div>
        <q-card square flat inline v-for="(item,idx) in reportTypes" :key="idx">
            <q-card-title>
                {{ item.name }}
            </q-card-title>
            <q-card-main>
            </q-card-main>
        </q-card>
    </div>
</template>

<script lang="ts">
    import {Vue} from 'vue-property-decorator';
    import {Loading} from 'quasar';
    import cfg from "../recon-config";
    import axios from 'axios';

    require('url-search-params-polyfill');

    export default Vue.extend({
        props: {
            reportRefCd: {type: String}
        },
        data() {
            return {
                reportType: '',
                reportTypes: new Array<any>()
            }
        },
        methods: {
            loadReportTypes() {
                Loading.show();
                axios.get(cfg.BASE_URL + "report/" + this.reportRefCd)
                    .then(response => {
                        this.reportTypes = response.data;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
            }
        },
        watch: {

            reportRefCd: function () {
                this.loadReportTypes();
                this.reportType = '';
            }
        },
        mounted(): void {
            this.loadReportTypes();
            this.reportType = '';
        }
    })
</script>
<style>
    .heading {
        font-size: large;
        font-weight: bold;
    }

    .window {
        padding: 1rem 2rem;
    }
</style>