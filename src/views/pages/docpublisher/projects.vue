<template>
    <div>
        <PageHeader :icon="'mdi mdi-cog h2'" :title="title" :items="item" />
        <div class="row justify-content-center">
            <div v-if="isLoading">
                <div id="preloader">
                    <div id="status">
                        <div class="spinner">
                            <i class="ri-loader-line spin-icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card-header bg-primary text-white d-flex align-items-center">
                    <h5 class="card-title text-white mb-0 d-flex">
                        <i class="ri-folder-4-fill mr-2  d-inline-block ri-lg"></i>Project Selection for DocPublisher
                    </h5>
                </div>

                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="container">
                            <form>
                                <div class="form-group row">
                                    <label class="col-md-12 col-form-label">Select Project<span
                                            class="text-danger">*</span></label>
                                    <div class="col-md-12">
                                        <!-- <select class="form-control" v-model="selectedproject" required>
                                            <option value="" disabled selected>Choose a Project</option>
                                            <option v-for="(item, index) in projectList" :key="index"
                                                :value="item.projectName">
                                                {{ item.projectName }}
                                            </option>
                                        </select> -->
                                        <multiselect v-model="selectedproject"
                                            :options="projectList.map(item => item.projectName)"
                                            placeholder="Choose a Project">
                                        </multiselect>
                                    </div>

                                </div>
                                <div v-if="hasData" class="form-group row">
                                    <label class="col-md-12 col-form-label">Select Branch<span
                                            class="text-danger">*</span></label>
                                    <div class="col-md-12">
                                        <!-- <select class="form-control" v-model="selectedBranch" required>
                                            <option value="" disabled selected>Choose a Branch</option>
                                            <option v-for="(item, index) in repobranchesdata" :key="index"
                                                :value="item.text">
                                                {{ item.text }}
                                            </option>
                                        </select> -->
                                        <multiselect v-model="selectedBranch"
                                            :options="repobranchesdata.map(item => item.text)"
                                            placeholder="Choose a Project">
                                        </multiselect>

                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="isButtonDisabled"
                                    @click.prevent="selectedproject !== '' && setdata(selectedProjectOwner, selectedProjectName)">
                                    Proceed to Publisher
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import checkurl from '../../../components/urlValidator';

import PageHeader from "@/components/page-header";
export default {
    components: {
        PageHeader,
        Multiselect
    },
    data() {
        return {
            selectedproject: '',
            userId: localStorage.getItem("userId"),
            items: "",
            selectedProjectOwner: "",
            selectedProjectName: null,
            selectedBranch: '',
            projectList: [],
            repobranchesdata: [],
            isLoading: false,
            title: 'DocPublisher',
            item: [
                {
                    text: "Dashboard",
                    href: "/"
                },
                {
                    text: "DocPublisher",
                    active: true
                }
            ],
        };
    },

    validateURL() {
        const newRepoUser = this.$route.params.repouser;
        const newRepoName = this.$route.params.reponame;
        const oldRepoUser = localStorage.getItem('repouser');
        const oldRepoName = localStorage.getItem('reponame');
        if (newRepoName !== oldRepoName || newRepoUser !== oldRepoUser) {
            checkurl(newRepoName);
        }
    },
    created() {
        this.validateURL()
    },
    mounted() {
        this.getprojectList();
        this.projectuser();

    },


    computed: {
        isButtonDisabled() {
            return this.selectedProjectName === null || this.selectedBranch === '';
        },
        hasData() {
            return this.repobranchesdata.length > 0;
        }
    },

    methods: {
        ...mapActions({ get: "userProjectDetails" }),
        setdata(owner, projectName) {
            localStorage.setItem("repouser", owner)
            localStorage.setItem('reponame', projectName)
            this.redirectProject(owner, projectName)
        },
        getprojectList() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.get(`/project/byuserid?userId=${this.userId}`)
                .then(() => {
                    console.log(this.$store.state.UserProject.suserprojectdata);
                    const projectid = this.$store.state.UserProject.suserprojectdata.map(
                        (item) => item.id
                    );
                    projectid.forEach((id) => {
                        this.$store.getters.client
                            .get(`/projectuser/byprojectid/byprojectuserid?userId=${this.userId}&projectId=${id}`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            })
                            .then((res) => {
                                loader.hide();
                                if (res.data.userRole.includes("DocPublisher")) {
                                    this.projectList.push(res.data);
                                }
                            });
                    });
                   
                })
                .catch((error) => {
                    console.error(error);
                    loader.hide();
                });
        },
        async redirectProject(repouser, reponame) {
            console.log("repouser, reponame", repouser, reponame);
            this.$router.push({ path: `/docpublisher/${repouser}/${reponame}/${this.selectedBranch}` });
        },
        async getRepoBranch() {
            this.isLoading = true;
            await this.$store.getters.client
                .get(
                    `orguser/repobranches?repoUser=${this.selectedProjectOwner}&repoName=${this.selectedProjectName}`
                )
                .then((res) => {
                    this.isLoading = false;
                    let length = res.data.length - 1;
                    this.brachName = res.data[length].name;
                    this.selectedBranch = res.data[0].name;
                    res.data.forEach((element) => {
                        this.repobranchesdata.push({
                            value: element.name,
                            text: element.name,
                        });
                    });

                })
                .catch((err) => {
                    console.log(err);
                    this.isLoading = false;
                });
        },
    },

    watch: {
        selectedproject(newVal) {
            const selectedProject = this.$store.state.UserProject.suserprojectdata.find((item) => item.projectName === newVal);
            this.selectedProjectOwner = selectedProject.owner;
            this.selectedProjectName = selectedProject.projectName;
            this.repobranchesdata = [],
                this.getRepoBranch(); // Call getRepoBranch function when selectedproject changes
        },
    },
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
  