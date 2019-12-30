<template>
    <div id="app">
        <q-layout view="hhr Lpr lff">
            <q-layout-header>
                <q-toolbar color="primary">

                    <q-btn
                            flat round dense
                            icon="menu"
                            @click="menuShown = !menuShown"
                    />

                    <q-toolbar-title>
                        Inteligentný dom
                    </q-toolbar-title>

                </q-toolbar>
            </q-layout-header>
            <q-layout-drawer :overlay=false width="150" :value="menuShown" side="left">
                <left-menu></left-menu>
            </q-layout-drawer>

            <q-page-container>
                <router-view/>
            </q-page-container>
        </q-layout>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import LeftMenu from './views/Menu.vue'

    export default Vue.extend({
        name: 'app',
        data() {
            return {
                menuShown: true
            }
        },
        components: {LeftMenu},
        methods: {}
    });
</script>