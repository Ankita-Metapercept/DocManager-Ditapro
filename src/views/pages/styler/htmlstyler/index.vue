<template>
    <div>
        <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-footer
            hide-close no-close-on-backdrop no-close-on-esc>
            <div class="card">
                <div class="card-body">
                    <strong>Please wait</strong>
                    <br />
                    <p>Working on customization to receive the desired output. </p>
                    <b-progress :value="progress" :max="100" style="height:5px;"></b-progress>
                </div>
            </div>
        </b-modal>
        <div class="row">
            <div class="col-xl-3 col-lg-4 mt-3 user-select-none">
                <b-card no-body>
                    <b-card class="bg-navbar">
                        <b-card-title>
                            <h5 class="card-titleNavbar text-white mb-0 d-flex align-items-center ">
                                HTML STYLER
                            </h5>
                        </b-card-title>
                    </b-card>
                    <div class="card-body">
                        <h5 class="font-size-14 ">MENU</h5>
                        <div id="accordion" class="custom-accordion categories-accordion mb-3">
                            <div class="categories-group-card">
                                <a class="categories-group-list"
                                    :class="{ active: currentFormNumber === 1, '': currentFormNumber === 1 }"
                                    @click="changeForm(1)">
                                    <i class="mdi mdi-apps font-size-16 align-middle mr-2"></i> Themes
                                </a>
                            </div>
                            <div class="categories-group-card">
                                <a class="categories-group-list" aria-controls="collapseTwo"
                                    :class="{ active: currentFormNumber === 2, '': currentFormNumber === 2 }"
                                    @click="changeForm(2)">
                                    <i class="mdi mdi-page-layout-header font-size-16 align-middle mr-2"></i> Header

                                </a>
                            </div>
                            <div class="categories-group-card">
                                <a class="categories-group-list collapsed" data-toggle="collapse" aria-expanded="false"
                                    aria-controls="collapseThree"
                                    :class="{ active: currentFormNumber === 3, '': currentFormNumber === 3 }"
                                    @click="changeForm(3)">
                                    <i class="mdi mdi-format-list-bulleted font-size-16 align-middle mr-2"></i> Table of
                                    content
                                </a>
                            </div>
                            <div class="categories-group-card">
                                <a class="categories-group-list collapsed" data-toggle="collapse" aria-expanded="false"
                                    aria-controls="collapseFour"
                                    :class="{ active: currentFormNumber === 4, '': currentFormNumber === 4 }"
                                    @click="changeForm(4)">
                                    <i class="mdi mdi-table font-size-16 align-middle mr-2"></i> Tables
                                </a>
                            </div>
                        </div>
                    </div>
                </b-card>
            </div>
            <div class="col-lg-9 mt-3">
                <b-card no-body>
                    <b-card class="bg-header">
                        <b-card-title class="form-header">
                            <h5 class="text-white mb-0 d-flex align-items-center">
                                <i :class="[childData.icons, 'headers-icons']"></i>
                                <span class="text-uppercase">{{ childData.title }} </span>
                            </h5>
                        </b-card-title>
                    </b-card>
                    <div class="mx-1">
                        <b-card-sub-title class="mt-2 mb-4">
                            <h6 class="card-subtitle  text-center"> {{ childData.paragraph }}</h6>
                        </b-card-sub-title>

                        <div v-if="currentFormNumber > 0 && currentFormNumber <= totalForms">
                            <component :formDataList="formDataList" :is="currentForm" :title="title"
                                :form-number="currentFormNumber" @form-submitnew="handleformSubmit"
                                @data-mounted="handleChildData" @next-form="handlenextbtn" @final-submit="finalSubmit">
                            </component>
                        </div>
                        <div v-else>
                            <p>No form found</p>
                        </div>
                    </div>
                </b-card>
            </div>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
import Swal from "sweetalert2";
import Header from './components/header.vue'
import TableOfContent from './components/table_of_content.vue'
import Themes from './components/themes.vue'
import Table from './components/table.vue'
import { FormWizard, TabContent } from "vue-form-wizard";
export default {
    components: {
        Header,
        TableOfContent,
        Themes,
        Table,
        FormWizard,
        TabContent
    },

    data() {
        return {
            progress: 0,
            childData: {},
            condition: true,
            currentFormNumber: 1,
            totalForms: 4,
            formDataList: {},
            title: {},
            userId: localStorage.getItem('userId'),
            orgId: localStorage.getItem('orgId'),
        }
    },

    computed: {
        _() {
            return _;
        },
        currentForm() {
            switch (this.currentFormNumber) {
                case 1:
                    return 'Themes'
                case 2:
                    return 'Header'
                case 3:
                    return 'TableOfContent'
                case 4:
                    return 'Table'
                default:
                    return null
            }
        },
    },
    methods: {
        handleChildData(data) {
            this.childData = data;
        },
        async defaultalert() {
            if (this.condition) {
                await Swal.fire({
                    title: "Are you sure?",
                    text: "This will set all attributes to default as dita-ot files. You will lose your previous attributes sets. Click confirm button to proceed.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Confirm",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.handledefualt()
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        console.log("cancle from alert");
                    }
                });
            }
        },
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        changeForm(formNumber) {
            this.currentFormNumber = formNumber
        },
        handleformSubmit(formData) {
            this.formDataList = JSON.parse(JSON.stringify({ ...this.formDataList, ...formData }))
        },
        handlenextbtn() {
            if (this.currentFormNumber < this.totalForms) {
                this.currentFormNumber++
            } else {
                console.log("fromdata from submit from ", this.formDataList)

            }
        },
        redirectDocPublishrer() {
            this.$router.push({
                path: `/htmldocstyler/docpublisher/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.$route.params.repobranch}`,
            });
        },
        finalSubmit() {
            this.progress = 0;
            this.$refs["modaloutputprogress"].show();
            const targetProgress = 100;
            const totalTime = 2000;
            const increment = (targetProgress / totalTime) * 50;

            const intervalId = setInterval(() => {
                if (this.progress < targetProgress) {
                    this.progress += increment;
                } else {
                    clearInterval(intervalId);
                }
            }, 20);
            // const targetProgress = 100;
            // const totalTime = 2000;
            // const increment = (targetProgress / totalTime) * 50;

            // const intervalId = setInterval(() => {
            //     if (this.progress < targetProgress) {
            //         this.progress += increment;
            //     } else {
            //         clearInterval(intervalId);
            //     }
            // }, 20);
            const body = {
                userId: this.userId,
                orgId: this.orgId,
                customizationOptions: this.formDataList
            }
            this.$store.getters.client
                .post(`/orguser/docstyler/customizeHtmlOutput`,
                    body
                )
                .then((res) => {
                    console.log('Res', res)
                    setTimeout(() => {
                        this.messageToast(
                            "Success",
                            "success",
                            "Your customization has been successfully completed, and now you can publish your document to receive the desired output."
                        );
                    }, 1000)
                    setTimeout(() => {
                        this.redirectDocPublishrer()
                        this.$refs["modaloutputprogress"].hide();
                    }, 2000);
                })
                .catch((err) => {
                    console.log("res", err);
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.data.message
                    );
                });
        },
        handledefualt() {
            const body = {
                userId: this.userId,
                orgId: this.orgId,
                customizationOptions: {}
            }
            this.$store.getters.client
                .post(`/orguser/docstyler/customizePdfOutput`,
                    body
                )
                .then((res) => {
                    console.log('Res', res)
                    this.redirectDocPublishrer()
                    this.messageToast(
                        "Success",
                        "success",
                        "Your DITA-OT has been reset to its default settings."
                    );
                })
                .catch((err) => {
                    console.log("res", err);
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.data.message
                    );
                });
        }
    }
}
</script>
  
<style scoped>
/* form {
    margin: 2rem 0;
    padding: 2rem;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
} */

.custon-btn {
    background: #2b313f !important;
    color: #fff !important;
    border-color: #2b313f !important;

    width: 90px;
    height: 30px;
}

.btn-info {
    width: 130px;
    /* font-size:90%; */
    height: 30px;
    /* overflow-x: scroll; */
    /* white-space: nowrap; */
}

.btn-container {
    display: flex;
    overflow-x: scroll;
}

.card-btn {
    margin: 10px;
    float: right;
}

.categories-group-list {
    cursor: pointer;
}

.categories-group-list.active {
    background-color: #252B3B;
    color: white;
}

.bg-card {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 0px;
    padding: 0px;
}

.bg-navbar {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 1vh;
    padding: 0px;
}

.bg-header {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 1vh;
    padding: 0px;
}

.custom-header {
    background-color: rgb(95, 163, 240) !important;
    margin-bottom: 0px;
    padding: 0px;
}

.headers-icons {
    color: #ffffff;
    font-size: 30px;
    margin-right: 5px;
}

.card-title {
    font-size: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
}

.card-titleNavbar {
    font-size: 15px;
    font-size: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
}

.card-subtitle {
    margin-bottom: -10px
}

.form-header {
    margin: -12px 0 -6px 0;
}
</style>
  