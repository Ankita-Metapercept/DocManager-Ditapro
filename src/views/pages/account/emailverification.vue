<template>
    <div>
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
                                                <h4 class="font-size-18 mt-4">Welcome !</h4>
                                                <p class="text-muted">
                                                    Verify to continue to DITAxPresso User.
                                                </p>
                                            </div>

                                            <b-alert v-if="isVerify == false" show variant="danger">
                                                Token Expired! If you want to get another link, you need to contact
                                                administrator using this email..
                                                <a href="mailto:techsupport@ditaxpresso.com"
                                                    class="text-decoration-underline">techsupport@ditaxpresso.com</a>
                                            </b-alert>
                                            <b-alert v-else show variant="success">Your account is verified successfully and
                                                instructions will sent to you on email!</b-alert>

                                            <div class="mt-5 text-center">
                                                <p>
                                                    {{ currentYear }} © ALL RIGHTS RESERVED BY DITAXPRESSO TECHNOLOGY
                                                    PRIVATE LIMITED
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

<script>
export default {
    data() {
        return {
            isVerify: false,
        };
    },
    computed: {
        currentYear() {
            return new Date().getFullYear();
        }
    },
    mounted() {
        this.tokenVerify()
    },
    methods: {
        async tokenVerify() {
            let loader = this.$loading.show({
                loader: "dots",
            });
          
            // setTimeout(function () {
            //     loader.hide();
            // }, 500);
            this.$store.getters.client.put(`orguser/emailverification?token=${this.$route.params.token}`).then((response) => {
                
                if (response.data.message === 'User Verified') {
                    this.isVerify = true
                }
                // this.isVerify = true;
                loader.hide();
            })
            .catch(() => {
                    loader.hide();
                });
        },
    },
};
</script>

<style></style>