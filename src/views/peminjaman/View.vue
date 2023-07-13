<template>
    <div class="container">
        <div class="card">
            <div class="container-fliud">
                <div class="wrapper row">
                    <div class="preview col-md-6">

                        <div class="preview-pic tab-content">
                            <div class="tab-pane active" id="pic-1"><img :src="basepath + book.path" /></div>
                        </div>

                    </div>
                    <div class="details col-md-6">
                        <h3 class="product-title">{{ book.judul }}</h3>
                        <p class="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                            viverra tristique ipsum et blandit. Phasellus ut libero arcu. Mauris et massa a enim iaculis
                            efficitur in vel urna. Phasellus a porta eros. Mauris aliquam, leo sit amet egestas ullamcorper,
                            enim urna ultrices elit, ac accumsan nunc metus a metus. Phasellus velit lorem, semper sit amet
                            nibh ac, mollis suscipit massa. Praesent vel purus egestas, dictum sapien non, mollis leo. Donec
                            id leo ut mi luctus aliquam eget ut lorem. Quisque a ex diam.</p>
                        <h6>Tanggal Peminjaman: <span class="text-primary">{{ peminjaman.tanggal_peminjaman }}</span></h6>
                        <h6 v-if="peminjaman.status == '2'">Batas Pengembalian: <span class="text-warning">{{
                            peminjaman.tanggal_pengembalian }}</span></h6>
                        <h6 v-if="peminjaman.status == '3'">Pengembalian: <span class="text-success">{{
                            peminjaman.tanggal_pengembalian }}</span></h6>
                        <h5 class="colors"></h5>
                        <div class="action">
                            <button v-if="peminjaman.status == '2' && tanggal_pengembalian >= tanggal_current"
                                class="btn btn-default btn-warning" type="button" data-bs-toggle="modal"
                                data-bs-target="#modalPinjam">Kembalikan
                                Buku</button>
                            <button v-if="peminjaman.status == '2' && tanggal_pengembalian < tanggal_current"
                                class="btn btn-default btn-danger" type="button" data-bs-toggle="modal"
                                data-bs-target="#modalPinjam">(Terlambat) Kembalikan
                                Buku</button>
                            <h6 v-if="peminjaman.status == '3'">Sudah dikembalikan</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalPinjam" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Kembalikan Buku</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="stok">Tanggal Pengembalian</label>
                        <input v-if="peminjaman.status == '2' && tanggal_pengembalian >= tanggal_current" type="date"
                            class="form-control" id="tanggal_kembali" placeholder="tanggal kembali"
                            :min="tanggal_peminjaman" :max="tanggal_pengembalian" v-model="tanggal_kembali">
                        <input v-if="tanggal_pengembalian < tanggal_current" type="date" class="form-control"
                            id="tanggal_kembali" placeholder="tanggal kembali" :min="tanggal_peminjaman"
                            v-model="tanggal_kembali">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="returnBuku"
                        data-bs-dismiss="modal">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'

export default {
    setup() {
    },

    data() {
        const route = useRoute()
        return {
            book: {},
            peminjaman: {},
            path: '',
            tanggal_current: new Date().toISOString().slice(0, 10),
            tanggal_peminjaman: '',
            tanggal_pengembalian: '',
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            id: route.params.id,
            token: localStorage.getItem('token'),
            id_user: localStorage.getItem('id_user')
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            axios.get(this.apiUrl + 'api/peminjaman/show/' + this.id, { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                this.peminjaman = res.data.data.book
                this.book = this.peminjaman.book
                this.tanggal_peminjaman = moment(String(this.peminjaman.tanggal_peminjaman)).format('YYYY-MM-DD')
                this.tanggal_pengembalian = moment(String(this.peminjaman.tanggal_pengembalian)).format('YYYY-MM-DD')
            }).catch((err) => {
                console.log(err.message)
            })
        },

        returnBuku() {
            let convert_tanggal_kembali = new Date(this.tanggal_kembali)
            convert_tanggal_kembali = this.dateFormater(convert_tanggal_kembali)
            axios.post(
                this.apiUrl + "api/peminjaman/book/" + this.peminjaman.id + "/return",
                {
                    tanggal_pengembalian: convert_tanggal_kembali,
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
                        this.load()
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'terjadi kesalahan saat input peminjaman',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
        },

        dateFormater(date) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var day = date.getDate();
            // get month from 0 to 11
            var month = date.getMonth();
            // conver month digit to month name
            month = months[month];
            var year = date.getFullYear();

            // show date in two digits
            if (day < 10) {
                day = '0' + day;
            }

            // now we have day, month and year
            // arrange them in the format we want
            return month + ' ' + day + ', ' + year;
        }
    },
}
</script>

<style scoped>
/*****************globals*************/
body {
    font-family: 'open sans';
    overflow-x: hidden;
}

img {
    max-width: 100%;
}

.preview {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}

@media screen and (max-width: 996px) {
    .preview {
        margin-bottom: 20px;
    }
}

.preview-pic {
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
}

.preview-thumbnail.nav-tabs {
    border: none;
    margin-top: 15px;
}

.preview-thumbnail.nav-tabs li {
    width: 18%;
    margin-right: 2.5%;
}

.preview-thumbnail.nav-tabs li img {
    max-width: 100%;
    display: block;
}

.preview-thumbnail.nav-tabs li a {
    padding: 0;
    margin: 0;
}

.preview-thumbnail.nav-tabs li:last-of-type {
    margin-right: 0;
}

.tab-content {
    overflow: hidden;
}

.tab-content img {
    width: 100%;
    -webkit-animation-name: opacity;
    animation-name: opacity;
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
}

.card {
    margin-top: 50px;
    background: #eee;
    padding: 3em;
    line-height: 1.5em;
}

@media screen and (min-width: 997px) {
    .wrapper {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }
}

.details {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}

.colors {
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
}

.product-title,
.price,
.sizes,
.colors {
    text-transform: UPPERCASE;
    font-weight: bold;
}

.checked,

.product-title,
.rating,
.product-description,
.price,
.vote,
.sizes {
    margin-bottom: 15px;
}

.product-title {
    margin-top: 0;
}

.size {
    margin-right: 10px;
}

.size:first-of-type {
    margin-left: 40px;
}

.color {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    height: 2em;
    width: 2em;
    border-radius: 2px;
}

.color:first-of-type {
    margin-left: 20px;
}

.add-to-cart,
.like {
    background: #ff9f1a;
    padding: 1.2em 1.5em;
    border: none;
    text-transform: UPPERCASE;
    font-weight: bold;
    color: #fff;
    -webkit-transition: background .3s ease;
    transition: background .3s ease;
}

.add-to-cart:hover,
.like:hover {
    background: #b36800;
    color: #fff;
}

.not-available {
    text-align: center;
    line-height: 2em;
}

.not-available:before {
    font-family: fontawesome;
    content: "\f00d";
    color: #fff;
}

.orange {
    background: #ff9f1a;
}

.green {
    background: #85ad00;
}

.blue {
    background: #0076ad;
}

.tooltip-inner {
    padding: 1.3em;
}

@-webkit-keyframes opacity {
    0% {
        opacity: 0;
        -webkit-transform: scale(3);
        transform: scale(3);
    }

    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes opacity {
    0% {
        opacity: 0;
        -webkit-transform: scale(3);
        transform: scale(3);
    }

    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

/*# sourceMappingURL=style.css.map */
</style>