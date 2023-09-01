<template>
  <div>
    <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-footer hide-close
      no-close-on-backdrop no-close-on-esc>
      <div class="card">
        <div class="card-body">
          <strong>Please wait</strong>
          <br />
          <p>loading . . .</p>
          <b-progress :value="75" :max="100" animated></b-progress>
        </div>
      </div>
    </b-modal>
    <!-- <b-modal id="modal-success"  ref="modalsuccess" title="Download Output" title-class="font-18" hide-footer>
      <div>
        <div style="text-align: center">
          <h6>Output is succesfully committed on github.</h6>
          <p>Click the download button to download the output.</p>
          <b-button class="btn btn-primary btn-block" v-on:click="openDownload()">Download</b-button>
        </div>
      </div>
    </b-modal> -->
    <b-modal id="modal-commit" v-model="showModal" ref="modalcommit" title="Commit Output" title-class="font-18"
      hide-footer hide-close no-close-on-backdrop no-close-on-esc>
      <div>
        <!-- <form class="form-horizontal" role="form"> -->
        <b-form-group label="Commit Message">
          <b-form-input for="text" v-model="commitMsg"></b-form-input>
        </b-form-group>
        <button class="btn btn-primary" v-on:click="commitOutput()">
          Commit
        </button>
        <!-- </form> -->
      </div>
    </b-modal>
    <!-- <div class="row">
      <div class="col-lg-12">
        <button class="btn btn-success" style="float: right; margin: 2px" size="sm" :disabled="disablecommitbutton"
          v-b-modal.modal-commit>
          Commit
        </button>
      </div>
    </div> -->
    <div v-if="hideform" class="row justify-content-center">
      <div class="col-md-6">
        <div class=" bg-primary text-white">
        </div>
        <div class="card shadow-sm">
          <div class="card-body">
            <form>
              <h5 class=" mb-4">Project Name : {{ $route.params.reponame }}</h5>
              <div>Please note that the download button will become available only after you make your
                commit. Thank you for your understanding.</div>
              <div class="d-flex justify-content-center pt-1">
                <button v-on:click="openDownload()" class="btn btn-primary btn-md mr-2 mb-2"
                  :disabled="disabledownloadbutton">
                  <span class="d-flex align-items-center">
                    <span>
                      <i class="fas fa-file-archive mr-2"></i>
                    </span>
                    <span>
                      Download Output
                    </span>
                  </span>
                </button>
                <button class="btn btn-success btn-md mr-2 mb-2" :disabled="disablecommitbutton"
                  @click.prevent="githubCommit">
                  <span class="d-flex align-items-center">
                    <span>
                      <i class="fab fa-github mr-2"></i>
                    </span>
                    <span>
                      Commit on GitHub
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div v-if="!hideform" class="card">
      <div class="card-body">
        <form novalidate @submit.prevent>
          <div class="form-group">
            <label>Title</label>
            <input v-validate="'required'" required v-model="typeform.releaseTitle" @keydown.space="preventLeadingSpace"
              name="releaseTitle" type="text" id="releaseTitle" class="form-control" placeholder="Enter Release Title"
              :class="{
                'is-invalid': submitted && $v.releaseTitle.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('releaseTitle') &&
              _.find(errors.items, { field: 'releaseTitle' }).rule ==
              'required'
              ">
              <!-- <span>Title field is required</span> -->
            </p>
          </div>
          <div class="form-group">
            <label>Input Source Ditamap</label>
            <div>
              <select class="form-control" v-validate="'required'" required v-model="typeform.inputPath">
                <option value="" disabled selected>Select Source Ditamap</option>
                <option v-for="data in selectInput" :key="data.path" :value="data.path">{{ data.fileName }}</option>
              </select>
              <p class="text-danger text-sm" v-show="errors.has('typeform.inputPath') && $v.typeform.inputPath.required">
                <span>Input Format selection is required</span>
              </p>
            </div>
          </div>
          <div class="form-group">
            <label>Output Format</label>
            <div>
              <select class="form-control" v-validate="'required'" required v-model="typeform.outputFormat">
                <option value="" disabled selected>Select Output Format</option>
                <option v-for="data in selectOutputFormat" :key="data.id" :value="data.transtype">{{ data.transtype }}
                </option>
              </select>
              <p class="text-danger text-sm"
                v-show="errors.has('typeform.outputFormat') && $v.typeform.outputFormat.required">
                <span>Output Format selection is required</span>
              </p>
            </div>
          </div>
          <div class="form-group mb-0">
            <div>
              <button :disabled="!(typeform.outputFormat && typeform.inputPath && typeform.releaseTitle)"
                class="btn btn-primary" v-on:click="generateOutputFun(projectPath, workspacePath)">
                Transform
              </button>
              <button @click="resetform" class="btn btn-primary m-l-5 ml-1">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import _ from "lodash";
import Swal from "sweetalert2";
import checkurl from '../../../../components/urlValidator';

export default {
  props: {
    ditaotVersion: String,
  },
  data() {
    return {
      userId: localStorage.getItem("userId"),
      orgId: localStorage.getItem("orgId"),
      userName: localStorage.getItem("userName"),
      typeform: {
        inputPath: "",
        outputPath: "",
        outputFormat: "",
        releaseTitle: "",
      },
      selectInput: null,
      selectOutputFormat: null,
      submitted: false,
      projectPath: null,
      typesubmit: false,
      workspacePath: null,
      disablebutton: false,
      disablecommitbutton: true,
      disabledownloadbutton: true,
      commitMsg: null,
      hideform: false,
      showModal: false
    };
  },

  created() {
    this.validateURL()
    this.getWorkspace();
    this.hideform = false
  },
  mounted() {
    this.getoutputFormat();
    this.makedefaultplugin()
    this.hideform = false
  },
  computed: {
    _() {
      return _;
    },
  },
  methods: {
    preventLeadingSpace(e) {
      // only prevent the keypress if the value is blank
      if (!e.target.value) e.preventDefault();
      // otherwise, if the leading character is a space, remove all leading white-space
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
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

    async getWorkspace() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      await this.$store.getters.client
        .get(`/orguser/workspace/byuserId?userId=${this.userId}`)
        .then(async (res) => {
          loader.hide()
          this.workspacePath = res.data.installedPath;
          this.projectPath =
            res.data.installedPath + "/" + this.$route.params.reponame;
          await this.getInputFiles(this.projectPath);
        })
        .catch((err) => {
          loader.hide()
          console.log(err);
        });
    },
    makedefaultplugin() {
      const body = {
        userId: this.userId,
        orgId: this.orgId,
        customizationOptions: ''
      }
      this.$store.getters.client
        .post(`/orguser/docstyler/customizePdfOutput`,
          body
        )
        .then((res) => {
          console.log(' makedefaultplugin Res', res)

        })
        .catch((err) => {
          console.log("res", err);
        });
      this.$store.getters.client
        .post(`/orguser/docstyler/customizePdfOutput`,
          body
        )
        .then((res) => {
          console.log(' makedefaultplugin Res', res)

        })
        .catch((err) => {
          console.log("res", err);
        });
    },
    async generateOutputFun(path, workspacePath) {
      this.disablebutton = true;
      let bitPath = workspacePath + "/dita-ot-" + this.ditaotVersion + "/bin";
      let outputParams = {
        inputPath: this.typeform.inputPath,
        binPath: bitPath,
        outputPath: path + "/output",
        outputFormat: this.typeform.outputFormat,
      };

      let releaseParams = {
        ditaMapFileName: this.typeform.inputPath.split("/").pop(),
        outputFormat: this.typeform.outputFormat,
        ditaotVersion: this.ditaotVersion,
        orgId: this.orgId,
        userId: this.userId,
        releaseTitle: this.typeform.releaseTitle,
        releasedBy: this.userName,
        projectName: this.$route.params.reponame
      };
      await this.$validator.validateAll().then((result) => {
        if (result) {
          this.$refs["modaloutputprogress"].show();
          console.log(result);
          this.$store.getters.client
            .post(`/orguser/docpublish`, outputParams)
            .then((res) => {
              console.log(res);
              this.disablebutton = false;
              setTimeout(() => {
                this.$refs["modaloutputprogress"].hide();
                this.messageToast(
                  "Output Generated",
                  "success",
                  `Output generated succesfully now you can commit the output`
                );
                this.typeform.inputPath = null;
                this.hideform = true
                this.typeform.outputFormat = null;
                this.disablecommitbutton = false;
                this.typeform.releaseTitle = null;
                this.$store.getters.client
                  .post(`/orguser/release`, releaseParams)
                  .then((res) => {
                    console.log("releaseNote", res);
                  })
                  .catch((err) => {
                    this.$refs["modaloutputprogress"].hide();
                    this.messageToast(
                      "invalid request",
                      "danger",
                      err.response.data.message
                    );
                    console.log(err);
                  });
              }, 10000);
            })
            .catch((err) => {
              console.log(err);
              this.$refs["modaloutputprogress"].hide();
              this.messageToast(
                "invalid request",
                "danger",
                err.response.data.message
              );
            });
        }
      });
    },
    commitOnGithub() {
      this.showModal = true;
    },
    githubCommit() {
      Swal.fire({
        title: "Enter Commit Message to Commit on Github",
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
          let commitProjectObj = {
            path: this.projectPath,
            message: commitMsg,
            githubUsername: localStorage.getItem("githubUsername"),
            email: localStorage.getItem("userEmail")
          };
          Swal.fire({
            title: "Commit request in progress...",
            allowOutsideClick: false,
            onOpen: () => {
              Swal.showLoading();
            },
          });
          this.$store.getters.client
            .put(`/orguser/workspace/commit`, commitProjectObj)
            .then((res) => {
              console.log(res);
              this.disabledownloadbutton = false;
              Swal.fire({
                icon: 'success',
                title: "Commit request completed successfully!",
                text: res.data.message,
              });
            })
            .catch((err) => {
              console.log(err);
              Swal.fire({
                icon: 'error',
                title: "Commit failed!",
                text: err.response.data.message,
              });
            });
        }
      });
    },

    async getInputFiles(path) {
      let ext = "ditamap";
      let loader = this.$loading.show({
        loader: "dots",
      });
      await this.$store.getters.client
        .get(`/orguser/workspace/inputfiles?path=${path}&extenssion=${ext}`)
        .then((res) => {
          loader.hide()
          this.selectInput = res.data;
          console.log("Input format", this.selectInput);
        })
        .catch((err) => {
          loader.hide()
          console.log(err);
        });
    },
    async getoutputFormat() {
      await this.$store.getters.client
        .get(`/plugins`)
        .then((res) => {
          this.selectOutputFormat = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetform() {
      this.typeform.inputPath = '';
      this.typeform.outputFormat = '';
      this.typeform.releaseTitle = '';
    },
    openDownload() {
      this.$router.push({
        path: `/docmanager/${this.$route.params.repouser}/${this.$route.params.reponame}`,
      });
    },
  },
};
</script>
