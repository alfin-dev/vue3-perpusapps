<template>
    <div class="container">
        <div class="card rounded shadow">
            <div class="card-header">
                Create Buku
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for="judul">Judul</label>
                        <input type="text" class="form-control" id="judul" placeholder="Masukkan judul buku"
                            v-model="formEdit.nama_kategori">
                    </div>
                    <button type="button" class="btn btn-primary mt-5" @click="storeCategory">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    setup() {
        const route = useRoute()
    },
    data() {
        const route = useRoute()
        return {
            formEdit: {},
            id: route.params.id,
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            axios.get('http://perpus-api.mamorasoft.com/api/category/' + this.id, { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                this.formEdit = res.data.data.category;
            }).catch((err) => {
                console.log(err.message);
            })
        },
        async storeCategory() {
            axios.post(
                "http://perpus-api.mamorasoft.com/api/category/update/" + this.id,
                {
                    ...this.formEdit,
                },
                {
                    'headers': {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + this.token
                    }
                }
            ).then(res => {
                if (res.data.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.$router.push({ name: 'category.index' })
                }
            }).catch((err) => {
                console.log(err.message);
            })
        },
    },
}
</script>