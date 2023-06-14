<template>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex align-items-center justify-content-center h-100">
        <div class="col-md-8 col-lg-7 col-xl-6">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid"
            alt="Phone image">
        </div>
        <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
          <h3 class="form-label mb-3" for="form1Example13">Login</h3>
          <form>
            <div class="form-outline mb-4">
              <input type="text" id="form1Example13" class="form-control form-control-lg" v-model="username" />
              <label class="form-label" for="form1Example13">Username</label>
            </div>

            <div class="form-outline mb-4">
              <input type="password" id="form1Example23" class="form-control form-control-lg" v-model="password" />
              <label class="form-label" for="form1Example23">Password</label>
            </div>

            <!-- Submit button -->
            <div>
              <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage" />
              <button type="button" class="btn btn-primary btn-lg btn-block" @click="storeUser">Sign in</button>
            </div>

            <div class="divider d-flex align-items-center my-4">
              <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
            </div>

            <router-link :to="{ name: 'register' }" class="btn btn-primary btn-lg btn-block"
              style="background-color: #3b5998">
              Register
            </router-link>

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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {

  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      fullPage: false
    }
  },

  components: {
    Loading
  },

  methods: {
    async storeUser() {
      this.isLoading = true
      try {
        const user = await axios.post(
          "http://perpus-api.mamorasoft.com/api/login",
          {
            username: this.username,
            password: this.password
          }
        );
        localStorage.setItem('token', user.data.data.token);
        localStorage.setItem('role', user.data.data.user.roles[0].name);
        localStorage.setItem('id_user', user.data.data.user.id);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Signed in successfully'
        })
        this.$router.push({ path: '/' })
      } catch (e) {
        this.isLoading = false
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Username / Password salah !',
        })
      }
    },
  },

};
</script>