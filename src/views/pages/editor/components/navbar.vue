<template>
    <div>
        <div style="background-color: #ffff;">
            <b-navbar toggleable="md" type="light" class="m-0 p-0">
                <div class="navbar-brand-box bg-white">
                    <a class="logo logo-dark">
                        <span class="logo-sm bg-white">
                            <img src="@/assets/images/logo-sm-dark.png" alt height="15" style="width:30px; height: auto;" />
                        </span>
                        <span class="logo-lg bg-white">
                            <img src="@/assets/images/logo-light.png" alt height="15" style="width:auto; height: auto;" />
                        </span>
                    </a>
                    <a class="logo logo-light  ">
                        <span class="logo-sm bg-white ">
                            <img src="@/assets/images/logo-sm-light.png" alt height="15"
                                style="width:30px; height: auto;" />
                        </span>
                        <span class="logo-lg bg-white">
                            <img src="@/assets/images/logo-dark.png" alt height="15" style="width:auto; height: auto;" />
                        </span>
                    </a>
                </div>
                <b-navbar-toggle target="nav-collapse">
                </b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <div>
                            <button type="button" class="btn btn-light mr-1 btn-sm" v-on:click="redirectDocmanager()">
                                <span class="d-flex align-items-center justify-content-center">
                                    <span>
                                        <i class="mdi mdi-arrow-left mr-1 "></i> <!-- Back Icon -->
                                    </span>
                                    <span>
                                        Back to DocManager
                                    </span>
                                </span>
                            </button>
                            <button type="button" class="btn btn-light mr-1 btn-sm"
                                v-on:click="redirectDocPublisher()"><span
                                    class="d-flex align-items-center justify-content-center">
                                    <span>
                                        <i class="mdi mdi-cog mr-1 "></i>
                                    </span>
                                    <span>
                                        DocPublisher
                                    </span>
                                </span>
                            </button>
                            <button type="button" class="btn btn-light mr-1 btn-sm" v-on:click="redirectDocStyler()">
                                <span class="d-flex align-items-center justify-content-center">
                                    <span>
                                        <i class="fas fa-pencil-ruler mr-1 "></i>
                                    </span>
                                    <span>
                                        DocStyler
                                    </span>
                                </span>
                            </button>
                        </div>
                    </b-navbar-nav>
                    <b-navbar-nav class="ml-auto">

                        <div class="d-flex align-items-center mr-2">
                            <div class="badge-soft-info mr-2 font-size-15 px-1 ">
                                <span>DITA-OT Version:</span>
                                <span class="ml-2">{{ this.ditaotVersion }}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mr-2">
                            <!-- <div class="badge-soft-info mr-2 font-size-15 px-1 "> -->

                            <!-- </div> -->
                        </div>
                        <div class="d-flex align-items-center mr-1">
                            <button type="button" class="btn header-item noti-icon waves-effect" @click="initFullScreen">
                                <i class="ri-fullscreen-line"></i>
                            </button>
                        </div>
                        <div class="d-flex align-items-center">
                            <b-nav-item-dropdown right>
                                <!-- Using 'button-content' slot -->
                                <template v-slot:button-content>
                                    <span class="rounded-circle header-profile-user" alt="Header Avatar"
                                        style="padding: 10px 12px 10px 12px">{{
                                            $store.state.Auth.userName.charAt(0) }}</span>
                                    <span class="d-none d-xl-inline-block ml-1">
                                        {{ $store.state.Auth.userName }}</span>
                                    <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                                </template>
                                <b-dropdown-item href="#">
                                    <p v-if="isOnline" class=" mb-0">
                                        <i class="mdi mdi-circle text-success align-middle mr-1"></i>
                                        Active now
                                    </p>
                                    <p v-else class="mb-0">
                                        <i class="mdi mdi-circle text-danger align-middle mr-1"></i>
                                        Offline now
                                    </p>
                                </b-dropdown-item>
                                <b-dropdown-item href="#"> <i class="ri-user-line align-middle mr-1"></i>
                                    {{ $t("navbar.dropdown.kevin.list.profile") }}</b-dropdown-item>

                                <b-dropdown-item href="#" @click="logOut"><i
                                        class="ri-shut-down-line align-middle mr-1 text-danger"></i>
                                    {{ $t("navbar.dropdown.kevin.list.logout") }}</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </div>

                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
    </div>
</template>
<script>
// import simplebar from "simplebar-vue";
import Swal from "sweetalert2";

import i18n from "../../../../i18n";
export default {
    data() {
        return {
            isOnline: navigator.onLine,
            ditaotVersion: '',
            languages: [
                {
                    flag: require("@/assets/images/flags/us.jpg"),
                    language: "en",
                    title: "English",
                },

                {
                    flag: require("@/assets/images/flags/french.jpg"),
                    language: "fr",
                    title: "French",
                },
                {
                    flag: require("@/assets/images/flags/spain.jpg"),
                    language: "es",
                    title: "spanish",
                },
                {
                    flag: require("@/assets/images/flags/chaina.png"),
                    language: "zh",
                    title: "Chinese",
                },
                {
                    flag: require("@/assets/images/flags/arabic.png"),
                    language: "ar",
                    title: "Arabic",
                },
            ],
            current_language: "en",
        };
    },
    // components: { simplebar },
    mounted() {
        this.getditaotversion();
    },
    created() {
        // Listen for the online and offline events
        window.addEventListener('online', this.updateOnlineStatus);
        window.addEventListener('offline', this.updateOnlineStatus);
    },
    destroyed() {
        // Clean up the event listeners when the component is destroyed
        window.removeEventListener('online', this.updateOnlineStatus);
        window.removeEventListener('offline', this.updateOnlineStatus);
    },
    methods: {
        updateOnlineStatus() {
            // Update the 'isOnline' data property based on the current navigator status
            this.isOnline = navigator.onLine;
            if(!navigator.onLine){
                Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  "Sorry, you are offline. Please check your internet connection and try again later.",
              });
            }
            
        },
        async getditaotversion() {
            this.getOrgId = window.localStorage.getItem('orgId')
            await this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.getOrgId}`)
                .then((response) => {
                    this.ditaotVersion = response.data[0].ditaotVersion
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        logOut() {
            this.$store.commit("removeToken");
            // Inside your logout method or button click handler
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            this.$router.push('/');
            console.log("logout");
            this.$router.push({ name: "Login" });
        },
        toggleMenu() {
            this.$parent.toggleMenu();
        },
        initFullScreen() {
            document.body.classList.toggle("fullscreen-enable");
            if (
                !document.fullscreenElement &&
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement
            ) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(
                        Element.ALLOW_KEYBOARD_INPUT
                    );
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        },
        toggleRightSidebar() {
            this.$parent.toggleRightSidebar();
        },
        setLanguage(locale) {
            i18n.locale = locale;
            this.current_language = i18n.locale;
        },
        redirectDocPublisher() {
            // Fetch user data from API
            const userId = localStorage.getItem('userId')
            const repoName = this.$route.params.reponame;
            this.$store.getters.client.get(`/project/byuserid?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((res) => {
                    const projectid = res.data.find((item) => item.projectName === repoName).id;
                    this.$store.getters.client.get(`/projectuser/byprojectid/byprojectuserid?userId=${userId}&projectId=${projectid}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((res) => {
                            if (res.data.userRole.includes("DocPublisher")) {
                                this.$router.push({
                                    path: `/doceditor/docpublisher/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.$route.params.repobranch}`,
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: "Sorry, you do not have access to DocPublisher. Please contact your administrator if you would like to access this feature. Thank you.",
                                });
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Sorry, you do not have access to DocPublisher. Please contact your administrator if you would like to access this feature. Thank you.",
                            });
                        });
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Sorry, you do not have access to DocPublisher. Please contact your administrator if you would like to access this feature. Thank you.",
                    });
                });
        },
        redirectDocmanager() {
            // Fetch user data from API
            const userId = localStorage.getItem('userId')
            const repoName = this.$route.params.reponame;
            this.$store.getters.client.get(`/project/byuserid?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((res) => {
                    const projectid = res.data.find((item) => item.projectName === repoName).id;
                    this.$store.getters.client.get(`/projectuser/byprojectid/byprojectuserid?userId=${userId}&projectId=${projectid}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((res) => {
                            console.log(res);
                            if (res.data.userRole.includes("DocManager")) {
                                this.$router.push({
                                    path: `/docmanager`,
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: "Sorry, you do not have access to DocManager. Please contact your administrator if you would like to access this feature. Thank you.",
                                });
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Sorry, you do not have access to DocManager. Please contact your administrator if you would like to access this feature. Thank you.",
                            });
                        });
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Sorry, you do not have access to DocPublisher. Please contact your administrator if you would like to access this feature. Thank you.",
                    });
                });
        },
        redirectDocStyler() {
            // Fetch user data from API
            const userId = localStorage.getItem('userId')
            const repoName = this.$route.params.reponame;
            this.$store.getters.client.get(`/project/byuserid?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((res) => {
                    const projectid = res.data.find((item) => item.projectName === repoName).id;
                    this.$store.getters.client.get(`/projectuser/byprojectid/byprojectuserid?userId=${userId}&projectId=${projectid}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((res) => {
                            if (res.data.userRole.includes("DocPublisher")) {

                                this.$router.push({
                                    path: `/docstyler/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.$route.params.repobranch}`,
                                });
                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: "Sorry, you do not have access to DocStyler. Please contact your administrator if you would like to access this feature. Thank you.",
                                });
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Sorry, you do not have access to DocPublisher. Please contact your administrator if you would like to access this feature. Thank you.",
                            });
                        });
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Sorry, you do not have access to DocPublisher. Please contact your administrator if you would like to access this feature. Thank you.",
                    });
                });
        },
    },
};
</script>