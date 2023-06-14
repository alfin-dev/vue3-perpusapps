<template>
    <header>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarExample01"
                    aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarExample01">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item active">
                            <router-link :to="{ name: 'book.index' }" class="nav-link">Book</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{ name: 'category.index' }" class="nav-link">Kategori</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{ name: 'peminjaman.index' }" class="nav-link">Peminjaman</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{ name: 'member.index' }" class="nav-link">Member</router-link>
                        </li>
                    </ul>
                    <div class="justify-content-end">
                        <button class="nav-link" @click="Logout">
                            <fa icon="right-from-bracket" /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <!-- Navbar -->

    </header>
    <router-view />
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
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
