<template>
    <div class="container">
        <section class="vh-100 gradient-custom-2">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-md-10 col-lg-8 col-xl-6">
                        <div class="card card-stepper" style="border-radius: 16px;">
                            <div class="card-header p-4">
                                <div class="d-flex justify-content-end align-items-center">
                                    <div>
                                        <h6 class="mb-0"> <a href="#">Pinjam Buku</a> </h6>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-4">
                                <div class="d-flex flex-row mb-4 pb-2">
                                    <div class="flex-fill">
                                        <h5 class="bold">{{ formView.judul }}</h5>
                                        <p class="text-muted"> Qt: {{ formView.stok }} item</p>
                                        <span class="small text-muted"> {{
                                            nama_kategori }} </span>
                                    </div>
                                    <div>
                                        <img class="align-self-center img-fluid" :src="basepath + formView.path"
                                            width="250">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
            formView: {},
            nama_kategori: '',
            basepath: 'http://perpus-api.mamorasoft.com/storage/',
            id: route.params.id,
            token: localStorage.getItem('token'),
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            axios.get(this.apiUrl + 'api/book/' + this.id, { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                this.formView = res.data.data.book;
                this.nama_kategori = this.formView.category.nama_kategori;
            }).catch((err) => {
                console.log(err.message);
            })
        },
    },
}
</script>

<style>
.gradient-custom-2 {
    /* fallback for old browsers */
    background: #a1c4fd;

    /* Chrome 10-25, Safari 5.1-6 */
    background: -webkit-linear-gradient(to right, rgba(161, 196, 253, 1), rgba(194, 233, 251, 1));

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: linear-gradient(to right, rgba(161, 196, 253, 1), rgba(194, 233, 251, 1))
}

#progressbar-1 {
    color: #455A64;
}

#progressbar-1 li {
    list-style-type: none;
    font-size: 13px;
    width: 33.33%;
    float: left;
    position: relative;
}

#progressbar-1 #step1:before {
    content: "1";
    color: #fff;
    width: 29px;
    margin-left: 22px;
    padding-left: 11px;
}

#progressbar-1 #step2:before {
    content: "2";
    color: #fff;
    width: 29px;
}

#progressbar-1 #step3:before {
    content: "3";
    color: #fff;
    width: 29px;
    margin-right: 22px;
    text-align: center;
}

#progressbar-1 li:before {
    line-height: 29px;
    display: block;
    font-size: 12px;
    background: #455A64;
    border-radius: 50%;
    margin: auto;
}

#progressbar-1 li:after {
    content: '';
    width: 121%;
    height: 2px;
    background: #455A64;
    position: absolute;
    left: 0%;
    right: 0%;
    top: 15px;
    z-index: -1;
}

#progressbar-1 li:nth-child(2):after {
    left: 50%
}

#progressbar-1 li:nth-child(1):after {
    left: 25%;
    width: 121%
}

#progressbar-1 li:nth-child(3):after {
    left: 25%;
    width: 50%;
}

#progressbar-1 li.active:before,
#progressbar-1 li.active:after {
    background: #1266f1;
}

.card-stepper {
    z-index: 0
}
</style>