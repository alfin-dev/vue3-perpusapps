<template>
    <div class="container my-4">
        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    Dashboard
                </div>
                <div class="card-body">
                    <div class="container-fluid">
                        <!-- Content Row -->
                        <div class="row">

                            <!-- Earnings (Monthly) Card Example -->
                            <div class="col-xl-3 col-md-6 mb-4" @click="redirectTo('book.index')">
                                <div class="card border-left-primary shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    Books</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ dashboard.totalBuku
                                                }}
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <fa icon="book" class="fa-2x text-secondary"></fa>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-3 col-md-6 mb-4" @click="redirectTo('book.index')">
                                <div class="card border-left-success shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Stok</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ dashboard.totalStok
                                                }}
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <fa icon="clipboard-list" class="fa-2x text-secondary"></fa>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-3 col-md-6 mb-4" @click="redirectTo('peminjaman.index')">
                                <div class="card border-left-success shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Dipinjam</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{
                                                    dashboard.totalDipinjam }}</div>
                                            </div>
                                            <div class="col-auto">
                                                <fa icon="book-open-reader" class="fa-2x text-secondary"></fa>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-3 col-md-6 mb-4" @click="redirectTo('peminjaman.index')">
                                <div class="card border-left-success shadow h-100 py-2">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Dikembalikan</div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{
                                                    dashboard.totalDikembalikan }}</div>
                                            </div>
                                            <div class="col-auto">
                                                <fa icon="book-open-reader" class="fa-2x text-secondary"></fa>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Paginate from 'vuejs-paginate-next';

export default {
    components: {
        paginate: Paginate,
    },
    data() {
        return {
            dashboard: {},
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
    },
    methods: {

        load() {
            axios.get(this.apiUrl + 'api/book/dashboard', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
            }).then(res => {
                this.dashboard = res.data.data.dashboard
            }).catch((err) => {
                alert(err.message);
            })
        },

        redirectTo(params) {
            this.$router.push({ name: params })
        }
    },
}
</script>