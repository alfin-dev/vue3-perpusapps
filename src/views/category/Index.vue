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
                <div class="table table-responsive">
                    <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" :height=64 :width=64 />
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
                                    <div class="btn-group me-2">
                                        <router-link :to="{ name: 'category.edit', params: { id: category.id } }">
                                            <fa icon="pencil" class="text-secondary" />
                                        </router-link>
                                    </div>
                                    <div class="btn-group me-2">
                                        <button type="button" class="nav-link" @click="deleteCategory(category.id)">
                                            <fa icon="trash" class="text-danger" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="example-one">
                    <vue-awesome-paginate :total-items="categories.total" :items-per-page="categories.per_page"
                        :max-pages-shown="3" :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
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
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
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
            axios.get('http://perpus-api.mamorasoft.com/api/category/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.categories = res.data.data.categories
                this.isLoading = false
            }).catch((err) => {
                this.isLoading = false
                console.log(err.message)
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
                            }).then(() => {
                                this.page = 1
                                this.load()
                            })

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
