<template>
    <q-list highlight>
        <q-list-header>Reports</q-list-header>
        <q-item v-for="report in reports" :to="report.refCd" :key="report.hash"> {{ report.name }}</q-item>
    </q-list>


    <!--<q-page-sticky v-show="refCd" position="bottom-right" :offset="[18, 18]">-->
    <!--<q-btn round color="secondary" @click="refCd = false" class="animate-pop">-->
    <!--<q-icon name="keyboard_backspace"/>-->
    <!--</q-btn>-->
    <!--</q-page-sticky>-->
</template>


<script lang="ts">
    import {Vue} from 'vue-property-decorator';
    import {Loading} from 'quasar';
    import cfg from "../recon-config";
    import axios from 'axios';

    export default Vue.extend({
        name: "LeftMenu",
        data() {
            return {
                reports: new Array<any>()
            }
        },
        mounted(): void {
            Loading.show();
            axios.get(cfg.BASE_URL + "report")
                .then(response => {
                    this.reports = response.data
                    Loading.hide();
                })
                .catch(error => {
                    Loading.hide();
                    alert(error)
                });
        }

    })
</script>