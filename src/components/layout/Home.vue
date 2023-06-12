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
                        <button class="btn btn-outline-danger btn-sm" @click="Logout">Logout</button>
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
