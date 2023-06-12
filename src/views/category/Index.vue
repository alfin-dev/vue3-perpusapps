<template>
    <div class="container my-4">
        <div class="d-flex justify-content-end mb-2">
            <router-link :to="{ name: 'category.create' }" class="btn btn-primary">Create</router-link>
        </div>
        <div class="card rounded shadow">
            <div class="card-header">
                List Kategori
            </div>
            <div class="card-body">
                <div class="input-group d-flex justify-content-end">
                    <div class="form-outline">
                        <input type="search" id="form1" class="form-control" @change="Search($event.target.value)"
                            placeholder="Search..." />
                    </div>
                    <!-- <button type="button" class="btn btn-primary">
                        Search
                    </button> -->
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Nama Kategori</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(category, index) in categories.data" :key="category.id">
                            <td>{{ (categories.current_page - 1) * categories.per_page + (index + 1) }}</td>
                            <td>{{ category.nama_kategori }}</td>
                            <td>
                                <div class="btn-group">
                                    <router-link :to="{ name: 'category.view', params: { id: category.id } }"
                                        class="btn btn-sm btn-outline-success">View</router-link>
                                    <router-link :to="{ name: 'category.edit', params: { id: category.id } }"
                                        class="btn btn-sm btn-outline-info">Edit</router-link>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                        @click="deleteCategory(category.id)">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <paginate :page-count="categories.last_page" :page-range="3" :margin-pages="2"
                        :click-handler="clickCallback" :prev-text="'Prev'" :next-text="'Next'"
                        :container-class="'pagination'" :page-class="'page-item'">
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
            categories: [],
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
            axios.get('http://perpus-api.mamorasoft.com/api/category/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.current_page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.categories = res.data.data.categories
            }).catch((err) => {
                console.log(err.message);
            })
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

        clickCallback(pageNum) {
            this.current_page = pageNum
            this.load()
        },

        deleteCategory(params) {
            Swal.fire({
                title: "Are you sure?",
                text: "Data buku yang sudah dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, I am sure!',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete('http://perpus-api.mamorasoft.com/api/category/' + params + '/delete', { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                        if (res.data.status == 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: res.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.load()
                            // this.$router.push({ path: '/' })
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