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
                            v-model="formEdit.judul">
                    </div>
                    <div class="form-group">
                        <label for="judul">Kategori</label>
                        <select class="form-select" v-model="formEdit.category_id">
                            <option v-for="category in categories" :value="category.id">
                                {{ category.nama_kategori }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="penerbit">Penerbit</label>
                        <input type="text" class="form-control" id="penerbit" placeholder="Penerbit"
                            v-model="formEdit.penerbit">
                    </div>
                    <div class="form-group">
                        <label for="pengarang">Pengarang</label>
                        <input type="text" class="form-control" id="pengarang" placeholder="Pengarang"
                            v-model="formEdit.pengarang">
                    </div>
                    <div class="form-group">
                        <label for="tahun">Tahun</label>
                        <input type="text" class="form-control" id="tahun" placeholder="Tahun" v-model="formEdit.tahun">
                    </div>
                    <div class="form-group">
                        <label for="stok">Stok</label>
                        <input type="number" class="form-control" id="stok" placeholder="Stok" v-model="formEdit.stok">
                    </div>
                    <div class="form-group">
                        <label for="cover">Cover</label>
                        <input type="file" class="form-control" id="cover" placeholder="Cover" @change="onChangeImage" />
                        <img v-if="item.imageUrl" :src="item.imageUrl" style="width: 10rem; height: 10rem;" class="mt-2" />
                        <img v-if="!item.imageUrl" :src="basepath + formEdit.path" style="width: 10rem; height: 10rem;"
                            class="mt-2" />
                    </div>
                    <button type="button" class="btn btn-primary mt-5" @click="storeBook">Submit</button>
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
            book: [],
            categories: [],
            formEdit: {},
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            item: {
                image: null,
                imageUrl: null
            },
            id: route.params.id,
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
        this.loadCategory()
    },
    methods: {
        load() {
            axios.get(this.apiUrl + 'api/book/' + this.id, { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                this.formEdit = res.data.data.book;
            }).catch((err) => {
                console.log(err.message);
            })
        },
        loadCategory() {
            axios.get(this.apiUrl + 'api/category/all/all', { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                this.categories = res.data.data.categories
                console.log(this.categories);
            }).catch((err) => {
                console.log(err.message);

            })
        },
        async storeBook() {
            axios.post(
                this.apiUrl + "api/book/" + this.id + "/update",
                {
                    ...this.formEdit,
                    path: this.image
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
                    }).then(() => {
                        this.$router.push({ path: '/book' })
                    })
                }
            }).catch((err) => {
                console.log(err.message);
            })
        },
        onChangeImage(e) {
            const file = e.target.files[0]
            this.image = file
            console.log(this.image);
            this.item.imageUrl = URL.createObjectURL(file)
        }
    },
}
</script>