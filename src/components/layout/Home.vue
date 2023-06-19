<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary" style="background-color: #e3f2fd;">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarExample01"
                aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
            <div class="collapse navbar-collapse" id="navbarExample01">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link :to="{ name: 'dashboard' }" class="nav-link"
                            :class="$route.name == 'dashboard' ? 'active' : ''"><b>Dashboard</b></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'book.index' }" class="nav-link"
                            :class="$route.name == 'book.index' ? 'active' : ''"><b>Book</b></router-link>
                    </li>
                    <li class="nav-item" v-if="role == 'admin'">
                        <router-link :to="{ name: 'category.index' }" class="nav-link"
                            :class="$route.name == 'category.index' ? 'active' : ''"><b>Kategori</b></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'peminjaman.index' }" class="nav-link"
                            :class="$route.name == 'peminjaman.index' ? 'active' : ''"><b>Peminjaman</b></router-link>
                    </li>
                    <li class="nav-item" v-if="role == 'admin'">
                        <router-link :to="{ name: 'member.index' }" class="nav-link"
                            :class="$route.name == 'member.index' ? 'active' : ''"><b>Member</b></router-link>
                    </li>
                </ul>
                <span class="navbar-text me-2">
                    {{ user.name }},
                </span>
                <div class="d-flex">
                    <button class="nav-link" @click="Logout">
                        <fa icon="right-from-bracket" /> <span class="navbar-text">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
    <!-- Navbar -->

    <router-view />
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            id_user: localStorage.getItem('id_user'),
            token: localStorage.getItem('token'),
            role: localStorage.getItem('role'),
            user: {}
        }
    },
    mounted() {
        this.getUser()
    },
    methods: {
        getUser() {
            axios.get('http://perpus-api.mamorasoft.com/api/user/' + this.id_user, { 'headers': { 'Authorization': 'Bearer ' + this.token } }).then(res => {
                this.user = res.data.data.user
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

<style>
@media (max-width: 300.98px) {
    .border-sm-start-none {
        border-left: none !important;
    }
}

.example-one .pagination-container {
    column-gap: 10px;
}

.example-one .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
}

.example-one .paginate-buttons:hover {
    background-color: #d8d8d8;
}

.example-one .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
}

.example-one .active-page:hover {
    background-color: #2988c8;
}

.example-one .back-button:active,
.example-one .next-button:active {
    background-color: #c4c4c4;
}
</style>
