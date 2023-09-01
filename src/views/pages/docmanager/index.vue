<template>
  <div >
    <PageHeader :icon="'fas fa-clipboard-list'" :title="title" :items="item" />
    <b-modal id="modal-progress" ref="modalprogress" title="Setting Up Your Workspace" title-class="font-18" hide-footer>
      <div class="card">
        <div class="card-body">
          <!-- <h5 class="card-title">Setting Up Your Workspace</h5> -->
          <div class="custom-control custom-checkbox mb-3">
            <input type="checkbox" class="custom-control-input" id="customCheck1" disabled checked />
            <label class="custom-control-label" for="customCheck1">DITA-OT</label>
          </div>
          <div class="custom-control custom-checkbox mb-3">
            <input type="checkbox" class="custom-control-input" id="customCheck2" disabled checked />
            <label class="custom-control-label" for="customCheck1">Projects</label>
          </div>
          <b-progress :value="75" :max="100" animated></b-progress>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-footer>
      <div class="card">
        <div class="card-body">
          <strong>Please wait</strong>
          <br />
          <p>loading . . .</p>
          <b-progress :value="progress" :max="100" style="height:5px;"></b-progress>
        </div>
      </div>
    </b-modal>
    <div>
      <!-- <div class="col-lg-6">
        <div class="media d-flex align-items-center">
          <div class="mr-3">
            <i class="fas fa-clipboard-list avatar-xs"></i>
          </div>
          <div class="media-body">
            <h5>Projects</h5>
          </div>
        </div>
      </div> -->
      <div class=" mb-0">
        <div class="d-flex align-items-center mb-1">
          <b-button class="puser-btn" variant="primary" size="sm"
            style="display: inline; float: right; margin-left: auto;" @click.prevent="syncprojects">
            <span class="">
              <i class="mdi mdi-folder-refresh mdi-18px"></i>
            </span>
            <span class="font-size-15 ml-2">Refresh</span>
          </b-button>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <b-row class="mt-4">
            <b-col cols="12" md="6" lg="6" v-for="item in paginatedProjectList" :key="item.id">
              <projectcard :items="item" />
            </b-col>
          </b-row>
          <div class="d-flex justify-content-end">
            <b-pagination v-model="currentPage" :total-rows="this.projectList.length" :per-page="perPage" />
          </div>
        </div>
      </div>
      <!-- Github login modal -->
      <div>
        <div class="my-4 text-center">
          <b-modal id="modal-standard" ref="modal" title="Github Login" title-class="font-18" hide-footer>
            <div class="row">
              <div class="col-lg-12">
                <b-card no-body class="text-center">
                  <b-card-body>
                    <img src="@/assets/images/github/Octocat.png" height="200" />
                    <b-card-title>
                      <h4 class="card-title">Connect with github</h4>
                    </b-card-title>
                    <b-card-text>
                      To access the project using github need to login in github
                    </b-card-text>
                    <a :href="clientId" class="btn btn-primary btn-block">Login</a>
                  </b-card-body>
                </b-card>
              </div>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import projectcard from "./components/projectcard";
import { mapActions } from "vuex";
import PageHeader from "@/components/page-header";
import { BRow, BCol, BPagination } from "bootstrap-vue";
import { URL } from '@/api/global.env.js'
export default {
  components: {
    projectcard,
    BRow,
    BCol,
    BPagination,
    PageHeader,
  },
  data() {
    return {
      title: "Projects",
      item: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Projects",
          active: true,
        },
      ],
      gitToken: null,
      projectData: null,
      clientId:
        `https://github.com/login/oauth/authorize?client_id=dbcf89847346091ebacd&scope=repo&redirect_uri=${URL}api/orguser/github/callback`,
      appAccess: {},
      isLoading: false,
      orgGithubUser: "",
      orgAccessURL: "",
      userGithubUsername: "",
      projectList: [],
      currentPage: parseInt(localStorage.getItem("currentPage")) || 1,
      progress: 0,
      perPage: 6,
      gitCode: null,
    };
  },
  created() {
    this.gitToken = localStorage.getItem("gitToken");
    this.orgId = localStorage.getItem("orgId");
    this.userId = localStorage.getItem("userId");
    this.userGithubUsername = localStorage.getItem("githubUsername");
    this.getProjectData();
  },
  computed: {
    paginatedProjectList() {
      if (this.projectList === null) {
        return []; // return empty array if projectList is null
      }
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.projectList.slice(startIndex, endIndex);
    },
  },
  watch: {
    currentPage(newVal) {
      localStorage.setItem("currentPage", newVal);
    },
  },
  mounted() {
    this.getToken();
    if (
      this.gitToken === "" ||
      this.gitToken === null ||
      this.gitToken === "null" ||
      this.gitToken === undefined ||
      this.gitToken === "undefined"
    ) {
      if (!window.location.search.includes("code")) this["$refs"].modal.show();
    }
  },
  methods: {
    ...mapActions({ get: "userProjectDetails" }),

    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    makeToast(variant = null) {
      this.$bvToast.toast("Toast body content", {
        title: `Toast ${variant || "default"}`,
        variant: variant,
        solid: true,
      });
    },
    // This method is use to validate get token using github api
    async getToken() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const gitCode = urlParams.get("code");
      this.gitCode = gitCode;
      if (!gitCode) {
        return;
      }
      // console.log(this["$refs"])
      this["$refs"].modal.hide();
      const loader = this.$loading.show({
        loader: "dots",
      });
      await this.getOrgDetails();
      this.$store.getters.client
        .get(`/orguser/github/success?code=${gitCode}`)
        .then((res) => {
          localStorage.setItem("gitToken", res.data.access_token);
          this.$store.commit("updateGitToken", {
            gitToken: res.data.access_token,
          });
          loader.hide();
          if (res.data.userData.login) {
            let domainVerify = null;
            let githubUserNameVerify = null;
            if (res.data.userData.email) {
              // Split orgGithubURL using a forward slash
              let gitUrlSplitArr = res.data.userData.email.split("@");
              // The array github url split initialize on data variable
              domainVerify = gitUrlSplitArr[1];

              githubUserNameVerify = res.data.userData.login;
            }
            if (
              domainVerify === this.orgAccessURL &&
              githubUserNameVerify === this.userGithubUsername
            ) {
              if (
                res.data.access_token !== null ||
                res.data.access_token !== ""
              ) {
                this.gitToken = res.data.access_token;
                this.username = res.data.userData.login;
              }
              if (res.data.access_token !== "") {
                // let gitAuthObj = {
                //   userId: this.$store.state.Auth.userId,
                //   orgId: this.$store.state.Auth.orgId,
                //   username: res.data.userData.login,
                //   email: res.data.userData.email,
                //   token: res.data.access_token,
                //   refreshToken: res.data.access_token,
                //   lastLoginIpAddress: userIP,
                // };
                // Add GitToken in database
                let workspaceParams = {
                  userId: this.$store.state.Auth.userId,
                  orgId: this.$store.state.Auth.orgId,
                  packeges: ["DITAOt-3.6", "Custom plugin"],
                  installedPath: "/home/techpubconnect-dxpressoapi/htdocs/DITAxPressoWorkspace",
                  isInstalled: true,
                };
                this.$refs["modalprogress"].show();
                this.$store.getters.client
                  .post(
                    `/orguser/workspace?orgId=${this.$store.state.Auth.orgId}`,
                    workspaceParams
                  )
                  .then((res) => {
                    console.log(res);
                    this.$refs["modalprogress"].hide();
                    this.messageToast(
                      "Workspace Created",
                      "success",
                      `Workspace Created Successfully`
                    );
                  })
                  .catch(() => {
                    // loading is disabled if error comes on organization details fetch
                    this.isLoading = false;
                  });
              }
            } else {
              this.messageToast(
                "Invalid Email",
                "danger",
                `You have to login in github using your organization email`
              );
              setTimeout(() => {
                localStorage.setItem("gitToken", null);
                window.location.href = `${URL}/docmanager`;
              }, 4000);
            }
          }
          return res;
        })
        .catch((err) => {
          loader.hide();
          console.log(err);
        });
    },
    async getOrgDetails() {
      // loading is enable till organization details not fetch
      this.isLoading = true;
      // Try requrest to get organization details
      this.$store.getters.client
        .get(`/serveradmin/organization/byorgid?orgId=${this.orgId}`)
        .then((res) => {
          this.appAccess = res.data[0];
          // loading is disabled once organization details fetched
          this.isLoading = false;
          var str = res.data[0].orgGithubURL;
          // Split orgGithubURL using a forward slash
          let gitUrlSplitArr = str.split("/");
          // The array github url split initialize on data variable
          this.orgGithubUser = gitUrlSplitArr[3];
          this.orgAccessURL = res.data[0].accessURL;
        })
        .catch((err) => {
          console.log(err);
          // loading is disabled if error comes on organization details fetch
          this.isLoading = false;
        });
    },
    syncprojects() {
      this.progress = 0;
      let body = {
        userId: this.userId,
        orgId: this.orgId,
        gitToken: localStorage.getItem("gitToken")
      };
      setInterval(() => {
        if (this.progress < 100) {
          this.progress += 50;
        }
      }, 1000);
      this.$refs["modaloutputprogress"].show();
      this.$store.getters.client
        .put(`/orguser/workspace/sync`, body)
        .then((response) => {
          console.log("sync project", response);
          setTimeout(() => {
            this.$refs["modaloutputprogress"].hide();
            this.selectedproject = "";
            this.messageToast(
              "Success",
              "success",
              "Sync complete! Your projects is up-to-date."
            );
          }, 2000);
        })
        .catch((error) => {
          console.log("error", error);
          setTimeout(() => {
            this.$refs["modaloutputprogress"].hide();
            this.messageToast(
              "Invalid request",
              "danger",
              "Sorry, we were unable to sync your project at this time. Please check your network connectivity and try again. If the issue persists, please contact our technical support team for further assistance"
            );
          }, 1000);
        });
    },
    async getProjectData() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.get(`/project/byuserid?userId=${this.userId}`).then(() => {
        console.log(
          this.$store.state.UserProject.suserprojectdata
        );
        this.projectList = this.$store.state.UserProject.suserprojectdata;
        loader.hide();
      });
    },
  },
};
</script>
