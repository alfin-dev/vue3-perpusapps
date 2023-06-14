<template>
    <div class="container my-4">
        <div class="d-flex justify-content-end mb-2">
            <router-link :to="{ name: 'book.create' }" class="btn btn-primary">Create</router-link>
        </div>
        <div class="card rounded shadow">
            <div class="card-header text-center">
                List Buku
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-end mb-2">
                    <div class="dropdown">
                        <a class="btn btn-sm btn-outline-secondary dropdown-toggle" href="#" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Export/Import
                        </a>

                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click="exportBook('pdf')">Export PDF</a></li>
                            <li><a class="dropdown-item" href="#" @click="exportBook('excel')">Export Excel</a></li>
                            <li><a class="dropdown-item" href="#" @click="importBook()">Import Excel</a></li>
                            <!-- <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">Import Excel</a></li> -->
                        </ul>
                    </div>
                </div>
                <div class="input-group d-flex justify-content-end">
                    <div class="form-outline">
                        <input type="search" id="form1" class="form-control" @change="Search($event.target.value)"
                            placeholder="Search..." />
                    </div>
                </div>
                <div class="table table-responsive">
                    <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" :height=64 :width=64 />
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for=" book in books.data">
                                <td><img :src="apiUrl + basepath + book.path" alt="" style="width: 40px; height: 40px;">
                                </td>
                                <td>{{ book.judul }}</td>
                                <td>{{ book.category.nama_kategori }}</td>
                                <td>
                                    <div class="btn-group me-2">
                                        <router-link :to="{ name: 'book.view', params: { id: book.id } }">
                                            <fa icon="eye" class="text-primary" />
                                        </router-link>
                                    </div>
                                    <div class="btn-group me-2">
                                        <router-link :to="{ name: 'book.edit', params: { id: book.id } }">
                                            <fa icon="pencil" class="text-secondary" />
                                        </router-link>
                                    </div>
                                    <div class="btn-group">
                                        <button type="button" class="nav-link" @click="deleteBook(book.id)">
                                            <fa icon="trash" class="text-danger" />
                                        </button>
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
import Loading from 'vue-loading-overlay';

export default {
    updated() {
        const parentVue = this
        let buttonDownload = document.getElementById('btn-download-template')
        if (buttonDownload != null) {
            buttonDownload.addEventListener('click', function (e) {
                parentVue.downloadTemplate()
            })
        }
    },
    data() {
        return {
            books: [],
            page: 1,
            search: '',
            basepath: 'storage/',
            token: localStorage.getItem('token'),
            isLoading: false,
            fullPage: false,
        }
    },
    components: {
        Loading
    },
    beforeMount() {
        this.load()
    },
    mounted() {
    },
    methods: {
        load() {
            this.isLoading = true
            axios.get(this.apiUrl + 'api/book/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.books = res.data.data.books
                this.isLoading = false
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'terjadi kesalahaan saat load data buku',
                    showConfirmButton: false,
                    timer: 1500
                })
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
                // this.page = 1
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
                    axios.delete(this.apiUrl + 'api/book/' + params + '/delete', { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
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
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'terjadi kesalahaan saat menghapus buku',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                }
            })
        },

        exportBook(params) {
            axios.get(this.apiUrl + 'api/book/export/' + params, {
                'headers': { 'Authorization': 'Bearer ' + this.token },
            }).then(res => {
                window.open(this.apiUrl + res.data.path, '_blank')
            }).catch((err) => {
                console.log(err.message)
            })
        },

        async importBook() {
            const { value: file } = await Swal.fire({
                title: 'Select a file',
                input: 'file',
                html:
                    '<button  :click="downloadTemplate" class="nav-link text-primary" id="btn-download-template">Download Template</button>',
                inputAttributes: {
                    'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'aria-label': 'Upload your Excel File'
                }
            })

            if (file) {
                if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    axios.post(
                        "http://perpus-api.mamorasoft.com/api/book/import/excel",
                        {
                            file_import: file
                        },
                        {
                            'headers': {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': 'Bearer ' + this.token
                            }
                        }
                    ).then(res => {
                        console.log(res.data);
                        if (res.data.status == 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: res.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.search = ''
                            this.page = 1
                            this.load()
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
                        console.log(err.message);
                    })
                }
                else {
                    alert('ini salah')
                }
            }
        },

        downloadTemplate() {
            axios.get(this.apiUrl + 'api/book/download/template', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
            }).then(res => {
                window.open(this.apiUrl + res.data.path, '_blank')
            }).catch((err) => {
                console.log(err.message);
            })
        }
    },
}
</script>