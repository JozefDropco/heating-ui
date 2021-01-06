<template>
    <q-list>
        <q-item to="/ServiceMode">{{$t('menu_serviceMenu')}}</q-item>
        <q-item to="/Watering">{{$t('menu_wateringMenu')}}</q-item>
        <q-item to="/Solar">{{$t('menu_solarMenu')}}</q-item>
        <q-item to="/Temperature">{{$t('menu_temperatureMenu')}}</q-item>
    </q-list>
</template>


<script lang="ts">
    import {Vue} from 'vue-property-decorator';

    export default Vue.extend({
        name: "LeftMenu"
    })
</script>
