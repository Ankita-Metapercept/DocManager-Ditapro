<template>
    <div>
        <PageHeader :title="title" :icon="'ri-dashboard-line h3'" :items="item" />
        <div>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="badge-soft-info mr-2 font-size-15 px-1 ">
                    <span>DITA-OT Version:</span>
                    <span class="ml-2">{{ this.ditaotVersion }}</span>
                </div>
            </div>
        </div>
        <b-modal id="modal-commit" ref="modalcommit" title="Commit Output" title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <div>
                <b-form-group label="Commit Message">
                    <b-form-input for="text" v-model="commitMsg"></b-form-input>
                </b-form-group>
                <button class="btn btn-primary" v-on:click="commitOutput()">
                    Commit on GitHub
                </button>
            </div>
        </b-modal>
        <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <div class="card">
                <div class="card-body">
                    <strong>Please wait</strong>
                    <br />
                    <p>loading . . .</p>
                    <b-progress :value="progress" :max="100" style="height:5px;"></b-progress>
                </div>
            </div>
        </b-modal>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title  d-flex align-items-center text-white ">
                        <i class="ri-folder-4-fill ri-xl mr-2"></i>GitHub Commit
                    </h5>
                </div>
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="col-md-12">
                            <form>
                                <div class="form-group row">
                                    <label class="col-md-12 col-form-label">Select Project<span
                                            class="text-danger">*</span></label>
                                    <div class="col-md-12">
                                        <select class="form-control" v-model="selectedproject" :value="projectlist"
                                            placeholder="Select DITA-OT version">
                                            <option value="" disabled selected>Select Project</option>
                                            <option v-for="(projects, index) in projectlist" :key="index" :value="projects.value
                                                ">
                                                {{ projects.text
                                                }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="d-flex pt-1">
                                    <button :disabled="!disabledCommit" type="submit"
                                        class="btn btn-success btn-sm btn-block mr-2 mb-2 m-0"
                                        @click.prevent="commitOutput">
                                        <div class="d-flex align-items-center justify-content-center"><span><i
                                                    class="mdi mdi-source-commit h4 text-white mr-2"></i></span><span>Commit
                                                on Github</span>
                                        </div>
                                    </button>
                                    <button type="submit" class="btn btn-primary btn-sm btn-block mb-2 m-0"
                                        @click.prevent="syncprojects">
                                        <div class="d-flex align-items-center justify-content-center">
                                            <span><i class="mdi mdi-sync h4 text-white"></i></span>
                                            <span class="ml-2 ">Sync Projects</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import _ from "lodash";
import { mapActions } from "vuex";
import Swal from "sweetalert2";
import PageHeader from "@/components/page-header";
export default {
    components: {
        PageHeader
    },
    props: {
        items: Object,
    },
    data() {
        return {
            ditaotVersion: '',
            progress: 0,
            selectedproject: "",
            projectlist: [],
            commitMsg: null,
            userId: localStorage.getItem("userId"),
            orgId: localStorage.getItem("orgId"),
            disabledCommit: false,
            title: "DocMigration",
            item: [
                {
                    text: "Dashboard",
                    href: "/"
                },
                {
                    text: "DocMigration",
                    active: true
                }
            ],
        };
    },
    computed: {
        _() {
            return _;
        },
        isCommitButtonDisabled() {
            return this.commitMsg.length === 0
        }
    },

    watch: {
        selectedproject: function (newVal) {
            if (newVal) {
                this.disabledCommit = true;
            } else {
                this.disabledCommit = false;
            }
        }
    },
    mounted() {
        this.getprojectslist()
        this.getditaotversion();
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        ...mapActions({ get: "userProjectDetails" }),
        async getditaotversion() {
            this.getOrgId = window.localStorage.getItem('orgId')
            console.log(this.getOrgId)
            await this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.getOrgId}`)
                .then((response) => {
                    console.log(response.data[0].ditaotVersion);
                    this.ditaotVersion = response.data[0].ditaotVersion
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getprojectslist() {
            let loader = this.$loading.show({
                loader: "dots"
            });
            console.log(this.orgId, this.userId);
            this.$store.getters.client.get(`/orguser/wordToDita/syncedprojects?orgId=${this.orgId}&userId=${this.userId}`)
                .then(response => {
                    response.data.forEach((ele) => {
                        this.projectlist.push({
                            value: ele.projectName,
                            text: ele.projectName,
                        })
                    })
                    loader.hide();
                })
                .catch(error => {
                    console.error(error);
                    loader.hide();
                });
        },
        gitHubCommit() {
            this.$refs["modalcommit"].show();
        },
        commitOutput() {
            this.progress = 0
            const targetProgress = 100;
            const totalTime = 5000; // 5 seconds in milliseconds
            const increment = (targetProgress / totalTime) * 50;
            const intervalId = setInterval(() => {
                if (this.progress < targetProgress) {
                    this.progress += increment;
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
            Swal.fire({
                title: "Submit Commit Message to commit on Github",
                input: "text",
                showCancelButton: true,
                confirmButtonText: "Submit",
                showLoaderOnConfirm: true,
                confirmButtonColor: "#556ee6",
                cancelButtonColor: "#f46a6a",
                preConfirm: (commitMsg) => {
                    return new Promise((resolve, reject) => {
                        if (commitMsg.trim() === "") {
                            reject(new Error("Please enter a commit message."));
                        } else {
                            resolve(commitMsg);
                        }
                    });
                },
                allowOutsideClick: false,
                inputValidator: (value) => {
                    return value.trim() !== "" ? undefined : "Please enter a commit message.";
                },
            }).then(({ value: commitMsg }) => {
                if (commitMsg !== undefined) {
                    let body = {
                        commitMessage: commitMsg,
                        userId: this.userId,
                        orgId: this.orgId,
                        commitFolderName: this.selectedproject,
                        ditaFolderName: this.$route.params.selectedfolder
                    }
                    Swal.fire({
                        title: "Commit request in progress...",
                        allowOutsideClick: false,
                        onOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    this.$store.getters.client
                        .post(`/orguser/wordToDita/commitDitaFiles`, body)
                        .then((res) => {
                            console.log(res);
                            this.showCommitBtn = false;
                            Swal.fire({
                                icon: 'success',
                                title: "Commit request completed successfully!",
                                text: res.data.message || res.data,
                            });
                            console.log("working!!");
                            this.commitMsg = null,
                                this.selectedproject = ""
                        })
                        .catch((err) => {
                            Swal.fire({
                                icon: 'error',
                                title: "Commit failed!",
                                text: err.response.data.message,
                            });
                            console.log("not working!!");
                            this.commitMsg = null,
                                this.selectedproject = ""
                        });
                }
            });
        },
        syncprojects() {
            this.progress = 0;
            let body = {
                "userId": this.userId,
                "orgId": this.orgId,
                gitToken: localStorage.getItem("gitToken")
            }
            setInterval(() => {
                if (this.progress < 100) {
                    this.progress += 50;
                }
            }, 1000);
            this.$refs["modaloutputprogress"].show();
            this.$store.getters.client.put(`/orguser/workspace/sync`
                , body
            ).then((response) => {
                console.log("sync project", response);
                setTimeout(() => {
                    this.$refs["modaloutputprogress"].hide();
                    this.selectedproject = ""
                    this.messageToast(
                        "Success",
                        "success",
                        "Sync complete! Your projects is up-to-date."
                    )
                }, 2000)
            }).catch((error) => {
                console.log("error", error);
                setTimeout(() => {
                    this.$refs["modaloutputprogress"].hide();
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        "Sorry, we were unable to sync your project at this time. Please check your network connectivity and try again. If the issue persists, please contact our technical support team for further assistance"
                    )
                }, 1000);

            })
        }
    }
}
</script>
  
<style scoped>
.btn-primary {
    background-color: #2b313f !important;
    color: #fff !important;
    transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
    background-color: #4c5aa7 !important;
}
</style>
  