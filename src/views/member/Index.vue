<template>
    <div class="container my-4">
        <div class="card rounded shadow">
            <div class="card-header">
                List Member
            </div>
            <div class="card-body">
                <div class="table table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Status User</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="member in members.data">
                                <td>
                                    <div class="d-flex align-items-center">
                                        <img src="https://mdbootstrap.com/img/new/avatars/8.jpg" alt=""
                                            style="width: 45px; height: 45px" class="rounded-circle" />
                                        <div class="ms-3">
                                            <p class="fw-bold mb-1">{{ member.name }}</p>
                                            <p class="text-muted mb-0">{{ member.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ member.name }}</td>
                                <td>{{ member.username }}</td>
                                <td>
                                    <span v-if="member.roles[0].name == 'admin'" class="badge text-bg-success">Admin</span>
                                    <span v-if="member.roles[0].name == 'member'"
                                        class="badge text-bg-primary">Member</span>
                                </td>
                                <td>
                                    <!-- <div class="btn-group">
                                    <router-link :to="{ name: 'book.view', params: { id: member.id } }"
                                        class="btn btn-sm btn-outline-success">View</router-link>
                                    <router-link :to="{ name: 'book.edit', params: { id: member.id } }"
                                        class="btn btn-sm btn-outline-info">Edit</router-link>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                        @click="deleteBook(member.id)">Delete</button>
                                </div> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="example-one">
                    <vue-awesome-paginate :total-items="members.total" :items-per-page="members.per_page"
                        :max-pages-shown="3" :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            members: [],
            page: 1,
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
            axios.get('http://perpus-api.mamorasoft.com/api/user/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.members = res.data.data.users
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'terjadi kesalahaan saat load data member',
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
                this.page = 1
                this.search = ''
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