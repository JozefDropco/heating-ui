<template>
    <q-list highlight>
        <q-list-header>{{$t('menu')}}</q-list-header>
        <q-item to="/ServiceMode">{{$t('menu_serviceMenu')}}</q-item>
        <q-item to="/Watering">{{$t('menu_wateringMenu')}}</q-item>
    </q-list>


    <!--<q-page-sticky v-show="refCd" position="bottom-right" :offset="[18, 18]">-->
    <!--<q-btn round color="secondary" @click="refCd = false" class="animate-pop">-->
    <!--<q-icon name="keyboard_backspace"/>-->
    <!--</q-btn>-->
    <!--</q-page-sticky>-->
</template>


<script lang="ts">
    import {Vue} from 'vue-property-decorator';

    export default Vue.extend({
        name: "LeftMenu"
    })
</script>