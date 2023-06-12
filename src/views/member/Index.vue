<template>
    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap@4.5.3/dist/css/bootstrap.css" />
    <div class="container my-4">
        <div class="d-flex justify-content-end mb-2">
            <router-link :to="{ name: 'book.create' }" class="btn btn-primary">Create</router-link>
        </div>
        <div class="card rounded shadow">
            <div class="card-header">
                List Member
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
                                <span v-if="member.roles[0].name == 'admin'"
                                    class="badge badge-success rounded-pill d-inline">Admin</span>
                                <span v-if="member.roles[0].name == 'member'"
                                    class="badge badge-info rounded-pill d-inline">Member</span>
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
                <div>
                    <paginate :page-count="members.last_page" :page-range="3" :margin-pages="2"
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
            members: [],
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
            axios.get('http://perpus-api.mamorasoft.com/api/user/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: this.current_page,
                    search: this.search,
                    per_page: 10
                },
            }).then(res => {
                this.members = res.data.data.users
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