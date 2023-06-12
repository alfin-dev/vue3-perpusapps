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
                <div>
                    <paginate :page-count="books.last_page" :page-range="3" :margin-pages="2" :click-handler="clickCallback"
                        :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'">
                    </paginate>
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
import Paginate from 'vuejs-paginate-next';

export default {
    components: {
        paginate: Paginate,
    },
    data() {
        return {
            books: [],
            current_page: 1,
            search: '',
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            axios.get('http://perpus-api.mamorasoft.com/api/peminjaman', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.current_page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.books = res.data.data.peminjaman
            }).catch((err) => {
                console.log(err.message);
            })
        },

        clickCallback(pageNum) {
            this.current_page = pageNum
            this.load()
        },

        Search: function (value) {
            if (value == null || value == '') {
                this.$router.go(0);
            } else {
                this.search = value
                this.current_page = 1
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