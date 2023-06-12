<template>
    <div class="container my-4">
        <div class="d-flex justify-content-end mb-2">
            <router-link :to="{ name: 'book.create' }" class="btn btn-primary">Create</router-link>
        </div>
        <div class="card rounded shadow">
            <div class="card-header">
                List Buku
            </div>
            <div class="card-body">
                Ini dashboard
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
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
    },
    methods: {

        load() {
            axios.get('http://perpus-api.mamorasoft.com/api/book/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    per_page: 10
                },
            }).then(res => {
                this.books = res.data.data.books
                console.log(this.books.total);
            }).catch((err) => {
                console.log(err.message);
            })
        },
        clickCallback(pageNum) {
            axios.get('http://perpus-api.mamorasoft.com/api/book/all', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
                'params': {
                    page: pageNum,
                    per_page: 10
                },
            }).then(res => {
                this.books = res.data.data.books
            }).catch((err) => {
                console.log(err.message);
            })
        },
        deleteBook(params) {
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
                    // this.$router.push({ path: '/' })
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
        },
        Logout() {
            localStorage.removeItem('token')
            this.$router.push({ name: 'login' });
        }
    },
}
</script>