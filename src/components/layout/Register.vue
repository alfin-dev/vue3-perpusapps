<template>
    <section class="vh-100">
        <div class="container py-5 h-100">
            <div class="row d-flex align-items-center justify-content-center h-100">
                <div class="col-md-8 col-lg-7 col-xl-6">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                        class="img-fluid" alt="Phone image">
                </div>
                <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                    <h3 class="form-label mb-3" for="form1Example13">Register</h3>
                    <form>
                        <div class="form-outline mb-4">
                            <input type="text" id="name" class="form-control form-control-lg" v-model="name" />
                            <label class="form-label" for="form1Example13">Nama</label>
                        </div>

                        <div class="form-outline mb-4">
                            <input type="text" id="username" class="form-control form-control-lg" v-model="username" />
                            <label class="form-label" for="form1Example13">Username</label>
                        </div>

                        <div class="form-outline mb-4">
                            <input type="email" id="email" class="form-control form-control-lg" v-model="email" />
                            <label class="form-label" for="form1Example13">Email</label>
                        </div>

                        <div class="form-outline mb-4">
                            <input type="password" id="password" class="form-control form-control-lg" v-model="password" />
                            <label class="form-label" for="form1Example23">Password</label>
                        </div>

                        <div class="form-outline mb-4">
                            <input type="password" id="retypePassword" class="form-control form-control-lg"
                                v-model="retypePassword" />
                            <label class="form-label" for="form1Example23">Re-type Password</label>
                        </div>


                        <!-- Submit button -->
                        <button type="button" class="btn btn-primary btn-lg btn-block" style="background-color: #3b5998"
                            @click="registerUser">Register</button>

                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

export default {

    data() {
        return {
            name: '',
            username: '',
            email: '',
            password: '',
            retypePassword: '',
        }
    },
    methods: {
        async registerUser() {
            try {
                await axios.post(
                    "http://perpus-api.mamorasoft.com/api/register",
                    {
                        name: this.name,
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        confirm_password: this.retypePassword
                    }
                ).then(res => {
                    console.log(res.data);
                    if (res.data.status == 409) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        // this.$router.push({ name: 'register' })
                    } else if (res.data.status == 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: res.data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.$router.push({ name: 'login' })
                    }
                })
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Data registrasi tidak boleh kosong !',
                })
            }
        },
    },

};
</script>