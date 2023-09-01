<template>
  <div>
    <PageHeader :icon="'fas fa-file-invoice'" :title="title" :items="items" />
    <!--Loader-->
    <div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="badge-soft-success mr-2 font-size-15  px-1 ">
          <span>Project Name :</span>
          <span class="ml-2">{{ this.projectName }}</span>
        </div>
        <div class="badge-soft-info mr-2 font-size-15 px-1 ">
          <span>DITA-OT Version:</span>
          <span class="ml-2">{{ this.ditaotVersion }}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div v-if="isLoading">
          <div id="preloader">
            <div id="status">
              <div class="spinner">
                <i class="ri-loader-line spin-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- Editor and publisher access-->
        <!-- <div class="col-lg-6 mb-2">
          <div class="media  d-flex align-items-center">
            <div class="mr-3">
              <i class="fas fa-file-invoice avatar-xs"></i>
            </div>
            <div class="media-body">
              <h5>DocManager</h5>
            </div>
          </div>
        </div> -->

        <div class="card-text">
          <div style="float: right">
            <button v-if="isDocEditor" style="margin: 0px 10px 0px 10px" class="btn btn-primary card-btn" type="submit"
              size="sm" @click="openEditor()">
              <span class="d-flex align-items-center justify-content-center">
                <span>
                  <i class="ri-file-edit-fill mr-2"></i>
                </span>
                <span>
                  DocEditor
                </span>
              </span>
            </button>
            <!-- <button v-if="isDocPublisher" style="margin: 0px 10px 0px 10px" class="btn btn-primary card-btn"
                type="submit" size="sm" v-on:click="redirectDocPublishrer()">
                DocPublisher
              </button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- Branches dropdown-->
    <div class="row mb-2 ">
      <label class=" col-label ml-3">Select Branch <span class="text-danger">*</span></label>
      <div class="col-lg-12 ">
        <select class="form-control" v-model="selected" placeholder="Select Branch" @change="getObject">
          <option value="" disabled>Please Choose Branch</option>
          <option v-for="(option, index) in repobranchesdata" :key="index" :value="option.value">{{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <!-- Source and Target-->
    <div class="row">
      <div class="col-xl-6">
        <b-card class="p-0 org-card" style="height: 60vh; ">
          <b-row class="justify-content-between mx-0 header p-3">
            <div class="d-flex">
              <span class="title ml-2"> Source </span>
            </div>
          </b-row>
          <!-- <b-row class="justify-content-between mx-0 px-3 py-2 footer-details " style="overflow-y: scroll">
            <v-jstree :data="treeData" multiple allow-batch whole-row @item-click="itemClick"></v-jstree>
          </b-row> -->
          <simplebar style="height: 60vh " class="mt-1">
            <v-jstree :data="treeData" multiple allow-batch whole-row @item-click="itemClick"></v-jstree>
          </simplebar>
        </b-card>
      </div>
      <div class="col-xl-6">
        <b-card class="p-0 org-card" style="height: 60vh; overflow-y: scroll">
          <b-row class="justify-content-between mx-0 header p-3">
            <div class="d-flex">
              <span class="title ml-2"> Target </span>
            </div>
          </b-row>
          <div class="download-field" v-on:click="downloadFun()">
            <div class="download-btn">
              <span style="display: block; text-align: center; font-size: 1.8rem; font-family: sans-serif;">Download as
                Zip</span>
              <img style="display: block; margin: 0 auto; height: 8rem;" src="../../../assets/toolbarsvgs/download.svg"
                alt="SVG Image" />
            </div>
          </div>

        </b-card>
      </div>
      <div class="editor-section" v-if="modal">
        <div v-if="!editorLoader" class="spinner w-100 height-100 d-flex justify-content-center align-items-center">
          <i class="ri-loader-line spin-icon"></i>
        </div>
        <div v-if="editorLoader">
          <div class="d-flex justify-content-between align-items-center border-bottom py-2 px-3">
            <div class="d-flex gap-3">
              <div class="pointer">File</div>
              <div class="pointer">Download</div>
            </div>
            <button class="btn btn-success" type="button" size="sm" @click="modal = false">
              Commit
            </button>
          </div>
          <b-row class="mx-0">
            <b-col cols="3" class="border-right pt-4">
              <v-jstree :data="treeData" multiple allow-batch whole-row @item-click="itemClick"></v-jstree>
            </b-col>
            <b-col cols="9" class="pt-4 px-5">
              <Editor />
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import listContent from "list-github-dir-content";
import pMap from "p-map";
import pRetry from "p-retry";
import saveFile from "save-file";
import axios from "axios";
import JSZip from "jszip";
import checkurl from '../../../components/urlValidator';
import simplebar from "simplebar-vue";
// import CKEditor from "@ckeditor/ckeditor5-vue";
import PageHeader from "@/components/page-header";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Editor from "./editor.vue";
export default {
  components: {
    Editor,
    PageHeader,
    simplebar,
  },
  data() {
    return {
      title: "DocManager",
      items: [
        {
          text: "Projects",
          href: `/docmanager`
        },
        {
          text: "DocManager",
          active: true,
        },
      ],

      treeData: [],
      repobranchesdata: [],
      ditaotVersion: '',
      projectName: this.$route.params.reponame,
      selected: "",
      isLoading: false,
      downloadURL: "",
      brachName: null,
      urlParserRegex: /^[/]([^/]+)[/]([^/]+)[/]tree[/]([^/]+)[/](.*)/,
      outputURL: null,
      gitToken: localStorage.getItem("gitToken"),
      isDocEditor: null,
      isDocPublisher: null,
      editor: ClassicEditor,
      editorData: null,
      editorLoader: false,
      modal: false,
      userId: localStorage.getItem('userId'),

    };
  },
  created() {
    this.getOrgDetails();
    this.validateURL()
  },
  async mounted() {
    this.getRepoBranch();
    this.getditaotversion();
  },
  methods: {
    // openEditor(){
    //   this.modal = true;
    //   setTimeout(()=>{this.editorLoader = true}, 2000)
    // },
    redirectDocPublishrer() {
      this.$router.push({
        path: `/docpublisher/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.brachName}`,
      });
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
    openEditor() {
      // fetch user data from API
      const repoName = this.$route.params.reponame;
      this.$store.getters.client.get(`/project/byuserid?userId=${this.userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => {

          const projectid = res.data.find((item) => item.projectName == repoName).id;
          this.$store.getters.client.get(`/projectuser/byprojectid/byprojectuserid?userId=${this.userId}&projectId=${projectid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then((res) => {
              if (res.data.userRole.includes("DocEditor")) {
                this.$router.push({
                  path: `/editor/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.brachName}`,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "Sorry, you do not have access to DocEditor. Please contact your administrator if you would like to access this feature. Thank you.",
                })
              }
            })
            .catch(() => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Sorry, you do not have access to DocEditor. Please contact your administrator if you would like to access this feature. Thank you.",
              })
            });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Sorry, you do not have access to DocEditor. Please contact your administrator if you would like to access this feature. Thank you.",
          })
        })
    },
    itemClick(node) {
      console.log(node.model.sha + " clicked !");
    },
    // Get organization detail
    async getOrgDetails() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      let orgId = localStorage.getItem("orgId");
      await this.$store.getters.client
        .get(`serveradmin/organization/byorgid?orgId=${orgId}`)
        .then((res) => {
          loader.hide();

          (this.isDocEditor = res.data[0].editor),
            (this.isDocPublisher = res.data[0].publisher);
        })
        .catch((err) => {
          loader.hide();
          console.log(err);
        });
    },
    // Get all branches inside repository
    async getRepoBranch() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      await this.$store.getters.client
        .get(
          `orguser/repobranches?repoUser=${this.$route.params.repouser}&repoName=${this.$route.params.reponame}`
        )
        .then(async (res) => {
          let length = res.data.length - 1;
          // this.selected = 'main'
          // loader.show();
          this.brachName = res.data[length].name;
          this.selected = res.data[length].name;
          res.data.forEach((element) => {
            this.repobranchesdata.push({
              value: element.name,
              text: element.name,
            });
          });

          this.outputURL = `https://github.com/${this.$route.params.repouser}/${this.$route.params.reponame}/tree/${res.data[length].name}/output`;
          await this.$store.getters.client
            .get(
              `project/outputtree?gitUsername=${this.$route.params.repouser}&gitReponame=${this.$route.params.reponame}&branchsha=${res.data[length].commit.sha}`
            )
            .then((res) => {
              this.treeData = res.data;
              loader.hide();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // Get tree of output folder in particular branch
    getObject(branchsha) {
      this.brachName = branchsha;
      this.isLoading = true;
      this.outputURL = `https://github.com/${this.$route.params.repouser}/${this.$route.params.reponame}/tree/${this.brachName}/bin/output`;
      this.$store.getters.client
        .get(
          `project/outputtree?gitUsername=${this.$route.params.repouser}&gitReponame=${this.$route.params.reponame}&branchsha=${branchsha}`
        )
        .then((res) => {
          this.treeData = res.data;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
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
    // Download output folder as a zip
    async downloadFun() {
      this.isLoading = true;
      const zipPromise = new JSZip();
      let user;
      let repository;
      let ref;
      let dir;
      try {
        const parsedUrl = new URL(this.outputURL);
        [, user, repository, ref, dir] = this.urlParserRegex.exec(
          parsedUrl.pathname
        );
        // console.log('Source:', {user, repository, ref, dir});
      } catch (err) {
        console.log(err);
      }
      const { private: repoIsPrivate } = await this.fetchRepoInfo(
        `${user}/${repository}`
      );
      const files = await listContent.viaTreesApi({
        user,
        repository,
        ref,
        directory: decodeURIComponent(dir),
        token: this.gitToken,
        getFullData: true,
      });
      const controller = new AbortController();
      const fetchPublicFile = async (file) => {
        const response = await axios.get(
          `https://raw.githubusercontent.com/${user}/${repository}/${ref}/${this.escapeFilepath(
            file.path
          )}`,
          {
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.statusText} for ${file.path}`);
        }
        return response.blob();
      };
      const fetchPrivateFile = async (file) => {
        const response = await axios.get(file.url, {
          headers: {
            Authorization: `Bearer ${this.gitToken}`,
          },
          signal: controller.signal,
        });
        const { content } = await response.data;
        const decoder = await fetch(
          `data:application/octet-stream;base64,${content}`
        );
        return decoder.blob();
      };
      let downloaded = 0;
      const downloadFile = async (file) => {
        const localDownload = () =>
          repoIsPrivate ? fetchPrivateFile(file) : fetchPublicFile(file);
        const onFailedAttempt = (error) => {
          console.error(
            `Error downloading ${file.url}. Attempt ${error.attemptNumber}. ${error.retriesLeft} retries left.`
          );
        };
        const blob = await pRetry(localDownload, { onFailedAttempt });
        downloaded++;
        const zip = await zipPromise;
        zip.file(file.path.replace(dir + "/", ""), blob, {
          binary: true,
        });
      };
      await pMap(files, downloadFile, { concurrency: 20 }).catch((error) => {
        controller.abort();
        if (!navigator.onLine) {
          console.log(
            "⚠ Could not download all files, network connection lost."
          );
        } else if (error.message.startsWith("HTTP ")) {
          console.log("⚠ Could not download all files.");
        } else {
          console.log(
            "⚠ Some files were blocked from downloading, try to disable any ad blockers and refresh the page."
          );
        }
        throw error;
      });
      console.log(`downloaded ${downloaded}`);
      this.isLoading = false;
      const zip = await zipPromise;
      const zipBlob = await zip.generateAsync({
        type: "blob",
      });
      await saveFile(
        zipBlob,
        `${user} ${repository} ${ref} ${dir}.zip`.replace(/\//, "-")
      );
      console.log(`Downloaded ${downloaded} files! Done!`);
    },
    async fetchRepoInfo(repo) {
      const response = await fetch(
        `https://api.github.com/repos/${repo}`,
        this.gitToken
          ? {
            headers: {
              Authorization: `Bearer ${this.gitToken}`,
            },
          }
          : {}
      );
      return response.json();
    },
    escapeFilepath(path) {
      return path.replaceAll("#", "%23");
    },
  },
};
</script>

<style>
.card-body {
  padding: 5px 0px 5px 0px;
}

.editor-section {
  position: fixed;
  width: 100%;
  min-height: 100vh;
  top: 0%;
  left: 0%;
  background: #fff;
  z-index: 2022;
}

.height-100 {
  height: 100% !important;
}

.gap-3 {
  gap: 0.75rem;
}

.pointer {
  cursor: pointer;
}

.editor-section .col-3,
.editor-section .col-9 {
  min-height: calc(100vh - 39px);
  overflow: auto;
}

.download-field {
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  height: 200px;
  margin-top: 2rem;
  margin: 2rem;
  border: 2px dashed gray;
}

.download-btn {
  text-align: center;
  cursor: pointer;
}

.download-text {
  display: block;
  font-size: 1.8rem;
  font-family: sans-serif;
}

.download-icon {
  display: block;
  height: 8rem;
  margin: 0 auto;
}
</style>
