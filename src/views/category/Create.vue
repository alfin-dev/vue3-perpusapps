<template>
    <div class="container">
        <div class="card rounded shadow">
            <div class="card-header">
                Create Category
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for="judul">Nama Kategori</label>
                        <input type="text" class="form-control" id="judul" placeholder="Masukkan Nama Kategori"
                            v-model="formEdit.nama_kategori">
                    </div>
                    <div>
                    </div>
                    <button type="button" class="btn btn-primary mt-5" @click="storeCategory">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
    setup() {
    },
    data() {
        return {
            formEdit: {},
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
    },
    methods: {
        async storeCategory() {
            axios.post(
                this.apiUrl + "api/category/create",
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
                if (res.data.status == 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        this.$router.push({ name: 'category.index' })
                    })
                } else {
                    console.log(res.data.message);
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