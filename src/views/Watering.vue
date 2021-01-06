<template>
    <div class="marginLeft5rem marginTop5rem">

      <q-breadcrumbs>
        <q-breadcrumbs-el label="Domov" to="/" />
        <q-breadcrumbs-el label="Zavlažovanie" to="/Watering" />
      </q-breadcrumbs>
      <br/>
        <q-table
                :pagination.sync="pagination"
                dense="true"
                selection="single"
                :selected.sync="rowSelected"
                :title="$t('menu_wateringMenu')"
                :data="tableData"
                :columns="columns"
                row-key="id"
        >
            <template slot="top-right" slot-scope="props">
                <q-btn icon="edit" label="Upraviť" @click="editWatering" />
                <q-btn icon="add" label="Pridať" @click="addWatering" />
            </template>
        </q-table>
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
                tableData: [],
                inputPins: [],
                pagination: {
                    sortBy: null, // String, column "name" property value
                    descending: false,
                    page: 1,
                    rowsPerPage: 10 // current rows per page being displayed
                },
                rowSelected: []
            }
        },
        computed: {
            columns: function () {
                if (i18n.locale === 'sk') {
                    return [{
                        name: 'Id',
                        required: true,
                        label: 'Id',
                        align: 'left',
                        field: 'id',
                        sortable: true,
                    }, {
                        name: 'RefCd',
                        required: true,
                        label: 'Unikátny identifikátor',
                        align: 'left',
                        field: 'zoneRefCode',
                        sortable: true,
                    }, {
                        name: 'Name',
                        required: true,
                        label: 'Meno',
                        align: 'left',
                        field: 'name',
                        sortable: true,
                    }, {
                        name: 'Mod',
                        required: true,
                        label: 'Modulo',
                        align: 'left',
                        field: 'modulo',
                        sortable: true,
                    }, {
                        name: 'Reminder',
                        required: true,
                        label: 'Deň',
                        align: 'left',
                        field: 'reminder',
                        sortable: true,
                    }, {
                        name: 'firstTime',
                        required: true,
                        label: '1. čas',
                        align: 'left',
                        field: function (row: any) {
                            return row.hour.toString().padStart(2, '0') + ':' + row.minute.toString().padStart(2, '0')
                        },
                        sortable: true,
                        style: 'width: 50px'
                    }, {
                        name: 'secondTime',
                        required: true,
                        label: '2. čas',
                        align: 'left',
                        field: function (row: any) {
                            if (row.retryHour !== undefined)
                                if (row.retryMinute !== undefined) {
                                    return row.retryHour.toString().padStart(2, '0') + ':' + row.retryMinute.toString().padStart(2, '0');
                                } else {
                                    return row.retryHour.toString().padStart(2, '0') + ':' + row.minute.toString().padStart(2, '0');
                                }
                            else if (row.retryMinute !== undefined) {
                                return row.hour.toString().padStart(2, '0') + ':' + row.retryMinute.toString().padStart(2, '0');
                            } else return '';
                        },
                        sortable: true,
                    }, {
                        name: 'duration',
                        required: true,
                        label: 'Trvanie',
                        align: 'left',
                        field: function (row: any) {
                            var rem = row.timeInSeconds;
                            var seconds = rem % 60;
                            rem -= seconds;
                            rem = rem / 60;
                            if (rem === 0) return seconds + 's';
                            var minutes = rem % (60);
                            rem -= minutes;
                            rem = rem / 60;
                            if (rem === 0 && seconds > 0) return minutes + 'min ' + seconds + 's';
                            if (rem === 0) return minutes + 'min';
                            return rem + 'h ' + minutes + 'min ' + seconds + 's';
                        },
                        sortable: true,
                    }, {
                        name: 'active',
                        required: true,
                        label: 'Aktívne',
                        align: 'left',
                        field: function (row: any) {
                            if (row.active) return 'Áno'; else return 'Nie';
                        },
                        sortable: true,
                    }];
                } else
                    return [{
                        name: 'Id',
                        required: true,
                        label: 'Identifier',
                        align: 'left',
                        field: 'id',
                        sortable: true,
                    }];
            }
        },
        methods: {
            loadCurrentState() {
                Loading.show();
                axios.get(cfg.BASE_URL + "watering")
                    .then(response => {
                        this.tableData = response.data;
                        Loading.hide();
                    })
                    .catch(error => {
                        Loading.hide();
                        alert(error)
                    });
            },
            editWatering() {
                this.$router.push({path: `/Watering/${(<any>this.rowSelected[0]).id}`});
            },
            addWatering() {
                this.$router.push({path: '/addWatering'});
            }
        },
        mounted(): void {
            this.loadCurrentState();
        }
    });
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
