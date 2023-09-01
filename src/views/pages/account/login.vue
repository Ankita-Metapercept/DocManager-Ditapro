<script>
export default {
  data() {
    return {
      isAuthenticate: false,
      email: null,
      password: null,
      validateCredentials: false,
      error: null,
      submitted: false
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    getsessionid(){
      this.$store.getters.client
          .get("/generateSessionId", {
            headers: {
              userId : localStorage.getItem('userId')
            },
          })
          .then((res) => {
           
            localStorage.setItem('sessionId', res.data.message)
            this.$store.commit('updateSessionId', res.data.message);
            this.$router.push({ name: "Dashboard" });
          })
          .catch((err) => {
            console.log("sessionToken err", err);
          });
    },
    login() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let loader = this.$loading.show({
            loader: "dots",
          });
          this.$store
            .dispatch("obtainToken", {
              email: this.email,
              password: this.password,
            })
            .then((res) => {
              loader.hide();
             console.log(res);
              if (this.$store.state.Auth.isEmailVerified == true) {
                if (this.$store.state.Auth.isActive == true) {
                  if (this.$store.state.Auth.isDeleted == false) {
                    if (this.$store.state.Auth.isSuperUser == false) {
                      this.getsessionid()
                      
                    } else {
                      this.messageToast(
                        "Error",
                        "danger",
                        "You cannot login from the same domain as organization has"
                      );
                    }
                  } else {
                    this.messageToast(
                      "Error",
                      "danger",
                      "Your organization is deleted"
                    );
                  }
                } else {
                  this.messageToast(
                    "Error",
                    "danger",
                    "Your account is inactive! please contact your admin to active your account."
                  );
                }
              } else {
                this.messageToast(
                  "Error",
                  "danger",
                  "Email not verified! please verify your email first to login into DITAxPresso."
                );
              }
            })
            .catch((error) => {
              this.error = error.response.data;
              loader.hide();
              this.messageToast(
                      "Error",
                      "danger",
                      error.response.data.message
                    );
              this.isAuthenticate = true;
              
              // this.errors.push(error.response.data.detail);
              this.validateCredentials = true;
            });
        }
      });
    },
  },
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <a href="/">
        <i class="mdi mdi-home-variant h2 text-white"></i>
      </a>
    </div>
    <div>
      <div class="container-fluid p-0">
        <div class="row no-gutters">
          <div class="col-lg-4">
            <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
              <div class="w-100">
                <div class="row justify-content-center">
                  <div class="col-lg-9">
                    <div>
                      <div class="text-center">
                        <!-- <div>
                          <a href="/" class="logo">
                            <img src="@/assets/images/logo-dark.png" height="20" alt="logo" />
                          </a>
                        </div> -->

                        <h4 class="font-size-18 mt-4">Welcome Back !</h4>
                        <p class="text-muted">
                          Login to continue to DITAxPresso.
                        </p>
                      </div>

                      <b-alert v-show="isAuthenticate" show dismissible variant="danger">Invalid Credentials!</b-alert>
                      <!-- <b-alert
                        variant="danger"
                        class="mt-3"
                        show
                        dismissible
                      >{{notification.message}}</b-alert> -->

                      <div class="p-2 mt-5">
                        <form class="form-horizontal" @submit.prevent="login">
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-mail-line auti-custom-input-icon"></i>
                            <label for="email">Email</label>
                            <input v-model="email" class="form-control" id="email" v-validate="'required|email'"
                              name="email" placeholder="Enter email" :class="{
                                'is-invalid': submitted && $v.email.$error,
                              }" />
                            <p class="text-danger text-sm" v-show="errors.has('email')">
                              {{ errors.first("email") }}
                            </p>

                            <div v-if="submitted && $v.email.$error" class="invalid-feedback">
                              <span v-if="!$v.email.required">Email is required.</span>
                              <span v-if="!$v.email.email">Please enter valid email.</span>
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="userpassword">Password</label>
                            <input v-validate="'required'" v-model="password" name="password" type="password"
                              class="form-control" id="userpassword" placeholder="Enter password" :class="{
                                'is-invalid': submitted && $v.password.$error,
                              }" />
                            <p class="text-danger text-sm" v-show="errors.has('password')">
                              {{ errors.first("password") }}
                            </p>

                            <div v-if="submitted && !$v.password.required" class="invalid-feedback">
                              Password is required.
                            </div>
                          </div>

                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="customControlInline" />
                            <label class="custom-control-label" for="customControlInline">Remember me</label>
                          </div>

                          <div class="mt-4 text-center">
                            <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                              Login
                            </button>
                          </div>

                          <!-- <div class="mt-4 text-center">
                            <router-link tag="a" to="/forgot-password" class="text-muted">
                              <i class="mdi mdi-lock mr-1"></i> Forgot your password?
                            </router-link>
                          </div> -->
                        </form>
                      </div>

                      <div class="mt-5 text-center">
                        <!-- <p>
                          Don't have an account ?
                          <router-link
                            tag="a"
                            to="/register"
                            class="font-weight-medium text-primary"
                          >Register</router-link>
                        </p> -->
                        <p>
                          {{ currentYear }} © ALL RIGHTS RESERVED BY DITAXPRESSO TECHNOLOGY PRIVATE LIMITED
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="authentication-bg">
              <div class="bg-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
