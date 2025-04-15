<template>
    <div class="container">
        <div class="card rounded shadow">
            <div class="card-header">
                Edit Kategori
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for="judul">Nama</label>
                        <input type="text" class="form-control" id="judul" placeholder="Masukkan nama kategori"
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
            baseUrl: this.apiUrl,
            id: route.params.id,
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            axios.get( this.baseUrl + '/kategori/detail/' + this.id, { 'headers': { 'Authorization': this.token } }).then(res => {
                this.formEdit = res.data.data;
            }).catch((err) => {
                console.log(err.message);
            })
        },
        async storeCategory() {
            axios.put(
                this.apiUrl + "/kategori/update/" + this.id,
                {
                    ...this.formEdit,
                },
                {
                    'headers': {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': this.token
                    }
                }
            ).then(res => {
                if (res.status == 200) {
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