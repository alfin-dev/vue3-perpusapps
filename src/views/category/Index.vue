<template>
    <div class="container my-4">
        <div class="d-flex justify-content-end mb-2">
            <router-link :to="{ name: 'category.create' }" class="btn btn-sm btn-outline-primary">Create new
                category</router-link>
        </div>
        <div class="card rounded shadow">
            <div class="card-header">
                List Kategori
            </div>
            <div class="card-body">
                <div class="input-group d-flex justify-content-end">
                    <div class="form-outline">
                        <input type="search" id="form1" class="form-control" @keyup="Search($event.target.value)"
                            placeholder="Search..." />
                    </div>
                    <!-- <button type="button" class="btn btn-primary">
                        Search
                    </button> -->
                </div>
                <div class="table table-responsive">
                    <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" :height=64 :width=64 />
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 5%;">No.</th>
                                <th>Nama Kategori</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(category, index) in categories.data" :key="category.ID">
                                <td>{{ (categories.meta.page - 1) * categories.meta.limit + (index + 1) }}</td>
                                <td>{{ category.nama_kategori }}</td>
                                <td>
                                    <div class="btn-group me-2">
                                        <router-link :to="{ name: 'category.edit', params: { id: category.ID } }">
                                            <fa icon="pencil" class="text-secondary" />
                                        </router-link>
                                    </div>
                                    <div class="btn-group me-2">
                                        <button type="button" class="nav-link" @click="deleteCategory(category.ID)">
                                            <fa icon="trash" class="text-danger" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="example-one">
                    <vue-awesome-paginate
                        v-if="categories && categories.meta"
                        :total-items="categories.meta.total_data"
                        :items-per-page="categories.meta.limit"
                        :max-pages-shown="3"
                        v-model="page"
                        :hide-prev-next-when-ends="true"
                        @click="clickCallback"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay';

export default {
    data() {
        return {
            categories: [],
            page: 1,
            search: '',
            basepath: this.baseUrl,
            token: localStorage.getItem('token'),
            isLoading: false,
            fullPage: false
        }
    },
    components: {
        Loading
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            this.isLoading = true
            axios.get(this.apiUrl + '/kategori/get', {
                'headers': { 'Authorization': this.token },
                'params': {
                    page: this.page,
                    search: this.search,
                    limit: 10
                },
            }).then(res => {
                this.categories = res.data
                this.isLoading = false
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'terjadi kesalahaan saat load data kategori',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
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

        clickCallback(pageNum) {
            this.page = pageNum
            this.load()
        },

        deleteCategory(params) {
            Swal.fire({
                title: "Are you sure?",
                text: "Data kategori yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, I am sure!',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(this.apiUrl + '/kategori/delete/' + params, { 'headers': { 'Authorization': this.token } }).then(res => {
                        if (res.status == 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: res.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                this.load()
                            })

                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: res.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }).catch((err) => {
                        Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: err.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        console.log(err.message);
                    })
                }
            })
        },
    },
}
</script>
