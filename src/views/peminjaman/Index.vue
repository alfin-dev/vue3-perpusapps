<template>
    <div class="container my-4">
        <div class="card rounded shadow">
            <div class="card-header">
                List Peminjaman
            </div>
            <div class="card-body">
                <div class="table table-responsive">
                    <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" :height=64 :width=64 />
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Peminjam</th>
                                <th>Tanggal Peminjaman</th>
                                <th>Tanggal Pengembalian</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="book in books.data">
                                <td><img :src="basepath + book.book.path" alt="" style="width: 40px; height: 40px;"></td>
                                <td>{{ book.book.judul }}</td>
                                <td>{{ book.member.name }}</td>
                                <td>{{ book.tanggal_peminjaman }}</td>
                                <td>{{ book.tanggal_pengembalian }}</td>
                                <td>
                                    <span v-if="book.status == '2'" class="badge text-bg-primary">Dipinjam</span>
                                    <span v-if="book.status == '3'" class="badge text-bg-success">Dikembalikan</span>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <router-link :to="{ name: 'peminjaman.view', params: { id: book.id } }"
                                            class="btn btn-sm btn-outline-success">View</router-link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="example-one">
                    <vue-awesome-paginate :total-items="books.total" :items-per-page="books.per_page" :max-pages-shown="3"
                        :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
    data() {
        return {
            books: [],
            page: 1,
            search: '',
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            token: localStorage.getItem('token'),
            isLoading: false,
            fullPage: false
        }
    },
    mounted() {
        this.load()
    },

    components: {
        Loading
    },

    methods: {
        load() {
            this.isLoading = true
            axios.get(this.apiUrl + 'api/peminjaman', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.books = res.data.data.peminjaman
                this.isLoading = false
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'terjadi kesalahaan saat load data peminjaman buku',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
        },

        clickCallback(pageNum) {
            this.page = pageNum
            this.load()
        },
    },
}
</script>