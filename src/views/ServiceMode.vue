<template>
    <div>
        <q-toggle class="q-ml-xm" v-model="state" label="Stav servisného modu" />
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
            }
        },
        methods: {
            loadCurrentState() {
                Loading.show();
                axios.get(cfg.BASE_URL + "ws/serviceMode")
                    .then(response => {
                        this.state = response.data.state;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
            },
            handleStateChange(){
                Loading.show();
                axios.post(cfg.BASE_URL + "ws/serviceMode?state="+this.state)
                    .then(response => {
                        this.state = response.data.state;
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

    .window {
        padding: 1rem 2rem;
    }
</style>