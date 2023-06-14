<template>
    <div class="container">
        <div class="d-flex justify-content-end mb-2">
            <router-link :to="{ name: 'book.create' }" class="btn btn-primary">Create</router-link>
        </div>
        <div class="card rounded shadow">
            <div class="card-header">
                List Peminjaman
            </div>
            <div class="card-body">
                <!-- <div class="input-group d-flex justify-content-end">
                    <div class="form-outline">
                        <input type="search" id="form1" class="form-control" @change="Search($event.target.value)"
                            placeholder="Search..." />
                    </div> -->
                <!-- <button type="button" class="btn btn-primary">
                        Search
                    </button> -->
                <!-- </div> -->
                <div class="table table-responsive">
                    <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" :height=64 :width=64 />
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Tanggal Peminjaman</th>
                                <th>Tanggal Pengembalian</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="book in books.data">
                                <td><img :src="basepath + book.book.path" alt="" style="width: 40px; height: 40px;"></td>
                                <td>{{ book.book.judul }}</td>
                                <td>{{ book.tanggal_peminjaman }}</td>
                                <td>{{ book.tanggal_pengembalian }}</td>
                                <td>
                                    <div class="btn-group">
                                        <router-link :to="{ name: 'book.view', params: { id: book.id } }"
                                            class="btn btn-sm btn-outline-success">View</router-link>
                                        <router-link :to="{ name: 'book.edit', params: { id: book.id } }"
                                            class="btn btn-sm btn-outline-info">Edit</router-link>
                                        <button type="button" class="btn btn-sm btn-outline-danger"
                                            @click="deleteBook(book.id)">Delete</button>
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
import { onMounted, ref } from 'vue'
import Vue from 'vue'
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

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
            axios.get('http://perpus-api.mamorasoft.com/api/peminjaman', {
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
                console.log(err.message);
            })
        },

        clickCallback(pageNum) {
            this.page = pageNum
            this.load()
        },

        Search: function (value) {
            if (value == null || value == '') {
                this.search = ''
                this.page = 1
                this.load()
            } else {
                this.search = value
                this.page = 1
                this.load()
            }
        },

        deleteBook(params) {
            Swal.fire({
                title: "Are you sure?",
                text: "Data buku yang sudah dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, I am sure!',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(params);
                    axios.delete('http://perpus-api.mamorasoft.com/api/book/' + params + '/delete', { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                        if (res.data.status == 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: res.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.page = 1
                            this.load()
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: res.data.message.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            // this.$router.push({ path: '/' })
                        }
                    }).catch((err) => {
                        console.log(err.message);
                    })
                }
            })
        },
    },
}
</script>