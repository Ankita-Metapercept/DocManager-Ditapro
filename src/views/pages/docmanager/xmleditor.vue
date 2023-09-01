<template>
  <div>
    <urlValidator></urlValidator>
    <PageHeader :title="title" :icon="'ri-file-edit-fill h2'" :items="items" />
    <div>
      <div>
        <b-modal id="commitProjectMessage" title="Important Message" hide-footer hide-close no-close-on-backdrop
          no-close-on-esc>
          <div class="alert alert-warning" role="alert">
            <strong>Saving the changes is necessary before committing.</strong>
          </div>
        </b-modal>
      </div>
      <div>
        <div class="d-flex align-items-center justify-content-between">
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
      
    </div>
    <div class="row ml-1 mb-2">
      <div class="col-md-8 bg-white d-flex align-items-center py-0">
        <i class="fas fa-folder mr-2"></i>
        <div class="truncated-path" v-if="currentfilePath !== null">
          {{ currentfilePath }}
        </div>
        <div v-else>Selected File Path</div>
      </div>
      <div class="col-md-3 ml-1 d-flex justify-content-end">
        <div class="col-md-6 mb-1" v-if="isDocPublisher">
          <button class="btn btn-primary card-btn" type="submit" size="sm" v-on:click="redirectDocPublisher()">
            <span class="d-flex align-items-center justify-content-center">
              <span>
                <i class="mdi mdi-cog mr-2"></i>
              </span>
              <span>
                DocPublisher
              </span>
            </span>
          </button>
        </div>
        <div class="col-md-6 mb-1" v-if="isDocPublisher">
          <button class="btn btn-primary card-btn" type="submit" size="sm" v-on:click="redirectDocStyler()">
            <span class="d-flex align-items-center justify-content-center">
              <span>
                <i class="fas fa-pencil-ruler mr-2"></i>
              </span>
              <span>
                DocStyler
              </span>
            </span>
          </button>
        </div>
        <div class="col-md-6 mb-1" v-if="isDocPublisher">
          <button class="btn btn-primary card-btn" type="submit" size="sm" v-on:click="redirectEditor()">
            <span class="d-flex align-items-center justify-content-center">
              <span>
                <i class="fas fa-pencil-ruler mr-2"></i>
              </span>
              <span>
                Editor
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-4">
        <div class="card">
          <div class="card-header bg-card">
            <h5 class="card-title text-white mb-0 align-item-center d-flex">
              <i class="ri-file-fill mr-1 ri-lg"></i>Ditamap Source
            </h5>
          </div>
          <div class="card-body" v-if="model !== null" style="overflow: scroll; height: 480px">
            <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
              <span>
                <i class="ri-book-read-fill icon-cog" v-if="isFolder"></i>
                <i class=" ri-file-text-fill icon-cog" v-else></i>
                {{ model.name }}
              </span>
              <span v-if="isFolder"><i class="fa fa-caret-up" v-if="isOpen"></i> <i class="fa fa-caret-down" v-else></i>
              </span>
            </div>
            <ul v-show="isOpen" v-if="isFolder" class="tree">
              <TreeItem class="item treeItems" v-for="model in model.children" :key="model.id" :model="model">
              </TreeItem>
              <tagView />
              <!-- <li class="add" @click="addChild"><i class="fa fa-caret-up"></i></li> -->
            </ul>
          </div>
        </div>
      </div>

      <div class="col-sm-8 mb-0 pb-0">
        <div class="card">
          <div class="card-header bg-card">
            <h5 class="card-title text-white mb-0 d-flex align-item-center">
              <i class="ri-file-edit-fill mr-1 ri-lg"></i>DocEditor
            </h5>
          </div>
          <div class="card-body" style=" height: 480px" data-simplebar>
            <div v-if="!xmlObject.html" class="table-responsive">
              <RecursiveTag :errorMessage="errMessage" :data="xmlObject" :peers="[]" :self="0" @remove="removeRoot" />

            </div>
            <div v-else class="text-center">
              <table class="table">
                <tbody>
                  <tr>
                    <td colspan="3" class="text-center font-size-14" style="margin-top: 10px;">
                      <div style="position: relative; display: inline-block;">
                        <img style="height: 250px; margin-bottom: 10px;" src="../../../assets/placeholder.png" />
                        <div style="bottom: 0; left: 0; right: 0; color: #666 ;  font-size: 20px;">
                          {{ errMessage || "Please select a valid XML file." }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="text-muted mt-0 pt-0 " v-if="!showCommitBtn && !xmlObject.html">
          <p>
            Please note that the commit button will become available only after you have saved the document. Thank you
            for your understanding.
          </p>
        </div>

        <div class="d-flex justify-content-end">
          <button v-if="!xmlObject.html" class="btn btn-primary mr-1 mb-2 col-md-3" @click="saveContent()">
            <i class="fas fa-save"></i> Save Content
          </button>
          <button v-if="!xmlObject.html" :disabled="!showCommitBtn" class="btn btn-success mr-1 mb-2 col-md-3"
            @click="githubCommit()">
            <i class="fab fa-github"></i> Commit on GitHub
          </button>
        </div>

      </div>
    </div>

    <!-- <b-modal id="modal-prevent-closing" ref="addtagmodal" title="ADD TAG" @show="resetModal" @hidden="resetModal"
        @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameState">
            <b-form-input id="name-input" v-model="name1" :state="nameState" required></b-form-input>
          </b-form-group>
        </form>
      </b-modal> -->
    <!-- <b-modal id="atr-modal" ref="editmodal" size="lg" title="Edit Tag">
        <div id="attributes">
          <section id="attributesWrapper">
            <AattributeItem v-for="(value, index) of clickedTag" :key="index" :value="value" :name="index"
              v-on:edit="editAttribute">
            </AattributeItem>
          </section>
        </div>
      </b-modal> -->
    <!-- <b-modal id="commitProjectModel" title="Commit Project" hide-footer ref="commitProjectModalRef">
      <div>
        <form class="form-horizontal" role="form">
          <b-form-group label="Commit Message">
            <b-form-input for="text" v-model="commitMsg"></b-form-input>
          </b-form-group>
          <button type="button" class="btn btn-primary" v-on:click="commitProject()">Commit</button>
        </form>
      </div>
    </b-modal> -->
  </div>
</template>


<script>

import _ from "lodash";
import { JsonToXml } from './convert.js'
import Swal from "sweetalert2";
import RecursiveTag from './components/recuresivetag'
// import AattributeItem from './components/attributeitem'
import PageHeader from "@/components/page-header";
import TreeItem from './components/TreeItems.vue'
import tagView from './components/tagView.vue'
import { eventBus } from "../../../main";
import xmlFormatter from 'xml-formatter';
import checkurl from '../../../components/urlValidator';

export default {
  data() {
    return {
      errMessage: null,
      title: "DocEditor",
      items: [
        {
          text: "Projects",
          href: `/docmanager`
        },
        {
          text: "DocEditor",
          active: true
        }
      ],
      xmlObjectold: {
        xtag: 'Root',
        Root: [], // the initial tag's childnodes array object
      },
      xmlObject: {
        xtag: 'Root',
        Root: [], // the initial tag's childnodes array object
      },
      modalVisible: false,
      names: '',
      lastSaved: 'N/A',
      timerId: null,
      nameState: null,
      submittedNames: [],
      isLoading: false,
      clickedTag: {},
      isAddAttr: false,
      newAttrName: 'newName',
      newAttrValue: 'newValue',
      historyObject: [],
      fileSHA: null,
      model: null,
      isOpen: true,
      fileContent: null,
      currentfilePath: null,
      localRepoPath: null,
      commitMsg: null,
      ditaotVersion: '',
      showAlert: false,
      isDocPublisher: null,
      xtag: null,
      text: null,
      showComponentA: true,
      getdatafromsessionStorage: false,

      showCommitBtn: false,
      showSaveContentBtn: false,
      intervalId: null,
      formattedXml: '',
      projectName: `${this.$route.params.reponame}`
    }
  },
  components: {
    RecursiveTag,
    PageHeader,
    TreeItem,
    tagView,
  },
  // watch: {
  //   '$route.params': {
  //     immediate: true,
  //     handler(newParams, oldParams) {
  //       const newRepoName = newParams.repouser;
  //       const oldRepoName = oldParams.repouser;

  //       if (newRepoName !== oldRepoName) {
  //         this.validateURL(newRepoName);
  //       }
  //     }
  //   },

  // },
  created() {
    this.validateURL()
    this.readXML()
    setInterval(this.myMethod, 60000);
    this.getOrgDetails();
    eventBus.$on('selectedTagData', (nodeId) => {
      this.selectedTag = nodeId
    })
    eventBus.$on("clicktag", async (data) => {
      let keys = Object.keys(data)
      this.$refs.editmodal.show()
      delete data[keys[keys.length - 1]]
      this.clickedTag = data;
    });
    eventBus.$on("edit", async (data) => {
      this.editAttribute(data)
      this.$refs.editmodal.hide()
      this.showAlert = true;
    });
  },

  mounted() {
    this.getfoldertree()
    let that = this;
    this.$nextTick(() => {
      eventBus.$emit('xmlData', that.xmlObject);
    });
    eventBus.$on('body-updated', (body) => {
      body.nodeDetails = this.xmlObject
      this.body = body;
      if (this.body) {
        this.$store.getters.client.post('/orguser/doceditor/editXml', this.body).then((res) => {
          let updatedData = res.data
          sessionStorage.setItem("xmlObject", JSON.stringify(updatedData))
          this.xmlObject = JSON.parse(sessionStorage.getItem("xmlObject"))
        }).catch((err) => {
          console.log("err", err);
        });
      }
    });

    eventBus.$on('valuechange', function () {
      // that.xmlObject = data
      sessionStorage.setItem("xmlObject", JSON.stringify(that.xmlObject))
    })
    eventBus.$on('add-attribute', function () {
      sessionStorage.setItem('xmlObject', JSON.stringify(that.xmlObject))
    })
    eventBus.$on('get-data', function (data) {
      that.xmlObject = data;
    });
    eventBus.$on('click-tag', function (data) {
      that.clickedTag = data;
    });
    eventBus.$on('clear-attributes', function () {
      that.clickedTag = {};
    });
    eventBus.$on('edit-happen', function () {
      that.record();
    });
    this.test()
  },
  computed: {
    isFolder() {
      return this.model.children && this.model.children.length
    },
    _() {
      return _;
    },
  },
  methods: {
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
            path: this.localRepoPath,
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
              this.showCommitBtn = false;
              Swal.fire({
                icon: 'success',
                title: "Commit request completed successfully!",
                text: res.data.message,
              });
              console.log("working!!");
            })
            .catch((err) => {
              console.log(err);
              Swal.fire({
                icon: 'error',
                title: "Commit failed!",
                text: err.response.data.message,
              });
              console.log("not working!!");
            });
        }
      });
    },

    formattedXmlText() {
      let result = this.processJson(this.xmlObject);
      let parser = new JsonToXml();
      result = parser.parse(result);
      this.formattedXml = xmlFormatter(result, { indentation: '  ' });
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
    redirectEditor() {
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
                  path: `/editor/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.brachName}`,
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

    async getOrgDetails() {
      let orgId = localStorage.getItem("orgId");
      await this.$store.getters.client
        .get(`serveradmin/organization/byorgid?orgId=${orgId}`)
        .then((res) => {
          (this.isDocEditor = res.data[0].editor),
            (this.isDocPublisher = res.data[0].publisher);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async test() {
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
    controlcommitbtn() {
      this.$refs.viewDetailsModel.show();
    },
    async getcontent() {
      eventBus.$on('getcontent', (data) => {
        this.fileContent = data.content;
        this.currentfilePath = data.path;
        let fileContentObjn = data.content;
        let domParser = new DOMParser();
        let xmlDom = domParser.parseFromString(fileContentObjn, 'application/xml');
        this.preProcess(xmlDom);
        this.xmlObjectold = null;
        if (!this.getdatafromsessionStorage) {
          this.xmlObjectold = this.xmlDomToJson(xmlDom.childNodes[0]);
        } else {
          this.xmlObjectold = sessionStorage.getItem();
        }
        this.xmlObjectold = this.xmlDomToJson(xmlDom.childNodes[0]);
        const body = {
          'nodeDetails': this.xmlObjectold
        };
        if (!data.path) return
        this.$store.getters.client
          .post(`/orguser/doceditor/generateNodeId`, body)
          .then((res) => {
            this.errMessage = res.data;
            sessionStorage.setItem("xmlObject", JSON.stringify(res.data));
            this.xmlObject = JSON.parse(sessionStorage.getItem("xmlObject"));
            this.sendData();
          }).catch((err) => {
            this.errMessage = err.response.data.message;
          });
        this.$emit('get-data', this.xmlObject);
      });
    },
    sendData() {
      let that = this
      eventBus.$emit('xmlData', that.xmlObject);
    },
    convertXmlObjectToXml() {
      let xmlString = this.convertToXml(this.xmlObject);
      return xmlString;
    },
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    remove() {
      eventBus.$emit('edit', {
        editWay: 'remove',
        name: this.name,
        value: this.value
      });
    },
    changeType() {
      if (!this.isFolder) {
        this.model.children = []
        this.addChild()
        this.isOpen = true
      }
    },
    addChild() {
      this.model.children.push({
        name: 'new stuff'
      })
    },
    async getfoldertree() {
      await this.$store.getters.client
        .get(`/orguser/workspace/byuserId?userId=${localStorage.getItem('userId')}`)
        .then(async (res) => {
          let path = res.data.installedPath + `/${this.$route.params.reponame}`
          this.localRepoPath = res.data.installedPath + `/${this.$route.params.reponame}`
          await this.$store.getters.client
            .get(`/orguser/workspace/repotree?path=${path}`)
            .then((tres) => {
              this.model = tres.data
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err);
        })
    },
    async readXML() {
      await this.getcontent()
      let fileContentObjn = this.fileContent
      let that = this;
      let domParser = new DOMParser()
      let xmlDom = domParser.parseFromString(fileContentObjn, 'application/xml');
      that.preProcess(xmlDom);
      that.xmlObject = null;
      that.xmlObject = that.xmlDomToJson(xmlDom.childNodes[0]);
      if (that.xmlObject.html && that.xmlObject.text) {
        return
      }
      that.$emit('get-data', that.xmlObject);
    },
    preProcess(xml) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        if (xml.childNodes[i].nodeType !== 1) {
          xml.removeChild(xml.childNodes[i]);
          i--;
        }
      }
    },
    xmlDomToJson(xml) {
      if (xml.nodeType != 1) {
        return null;
      }
      let obj = {};
      /* obj has following attributes: 
      *   obj.xtag : the name of the xml element
      *   obj.text : the text of the xml element(if it has)
      *   obj[obj.xtag] : the childNodes of the xml element (object form)
      *   others are named by the xml element's attributes' names
      */
      obj.xtag = xml.nodeName;

      //replace the carriage returns, line feeds and spaces with ''
      let nodeText = (xml.textContent || '').replace(/(\r|\n)/g, "").replace(/^\s+|\s+$/g, "");
      if (nodeText && xml.childNodes.length == 1) {
        obj.text = nodeText;
      }

      //convert the xml element's attributes
      if (xml.attributes.length > 0) {
        for (let i = 0; i < xml.attributes.length; i++) {
          let attribute = xml.attributes[i];
          obj[attribute.nodeName] = attribute.nodeValue;
        }
      }
      //convert the xml element's childNodes
      let items = [];
      for (let i = 0; i < xml.childNodes.length; i++) {
        let node = xml.childNodes[i];
        let item = this.xmlDomToJson(node); //call recursion to convert childNodes 
        if (item) {
          items.push(item);
        }
      }
      /*even this node has no childs, it's corresponding object 
      *still own a children array attribute in order to add child
      * in the vue data object , if we want to add child to this 
      * node in the future .  I think this is a convenient solution.
      */
      obj[obj.xtag] = items;
      return obj;
    },
    getData(data) {
      this.clickedTag = data;
    },
    removeRoot() {
      this.record();
      this.xmlObject = {};
      this.clickedTag = {};
    },
    record() {
      let a = this.deepCopy(this.xmlObject);
      this.historyObject.push(a);
      //I think storing 10 records is enough 
      if (this.historyObject.length > 10) {
        this.historyObject.shift();
      }
    },
    // editAttribute(data) {
    //   this.record();
    //   switch (data.editWay) {
    //     case 'remove':
    //       if (data.name == 'xtag') {
    //         alert('xtag should not be removed !')
    //         return
    //       }
    //       this.$delete(this.clickedTag, data.name);
    //       break;
    //     case 'change':
    //       this.$set(this.clickedTag, data.name, data.value);
    //       this.saveContent()
    //   }
    // },
    // saveNewAttr() {
    //   this.record();
    //   this.$set(this.clickedTag, this.newAttrName, this.newAttrValue);
    //   this.isAddAttr = false;
    // },
    undo() {
      if (this.historyObject.length == 0) {
        alert('no history found!');
        return
      }
      this.xmlObject = this.historyObject.pop();
      this.clickedTag = {};
    },
    sendTextAjax: function (interfacever, sendData, func) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = '';
      //get and process data
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
          xhr.setRequestHeader("If-Modified-Since", "0");
          xhr.setRequestHeader('Cache-Control', 'no-cache');
          xhr.setRequestHeader('Content-Type', 'application/json');
        }
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.statuss == 304) {
            let data = xhr.response;
            if (func) {
              func(data);
            }
          } else {
            if (interfacever.alertMessage) {
              alert(interfacever.alertMessage + ' ' + xhr.status);
            }
          }
        }
      }
      //send data
      if (typeof sendData == 'object') {
        sendData = JSON.stringify(sendData);
      }
      if (interfacever.type == "GET" || interfacever.type == 'get') {
        xhr.open("GET", interfacever.url + "?data=" + sendData, true);
      } else {
        xhr.open("POST", interfacever.url, true);
      }
      xhr.send(sendData);
    },
    //deep copy of array and object
    deepCopy: function (origin) {
      let copy = null; //copy of statement
      if (origin.constructor === Array) { //check data type
        copy = [];
      } else if (origin.constructor === Object) {
        copy = {};
      }
      for (let i in origin) {
        //Both Array and Object types have Object constructors on their prototype chains
        if (origin[i] instanceof Object) {
          copy[i] = this.deepCopy(origin[i]); //Continue to call the deep copy function for properties of array and object types
        } else {
          copy[i] = origin[i];
        }
      }
      return copy;
    },
    //Number Quick Sort
    quickSort: function (origin) {
      let a = this.deepCopy(origin);
      //conversion type
      for (let i = 0; i < a.length; i++) {
        if (!isNaN(parseFloat(a[i]))) {
          a[i] = parseFloat(a[i]);
        }
      }
      if (a.length <= 1) {
        return a;
      }
      let flagIndex = Math.floor(a.length / 2);
      let flag = a.splice(flagIndex, 1)[0];
      let left = []; //store elements smaller than flag
      let right = []; //Store elements larger than flag
      for (let i = 0; i < a.length; i++) {
        if (a[i] < flag) {
          left.push(a[i]);
        } else {
          right.push(a[i]);
        }
      }
      //recursive condition
      return this.quickSort(left).concat(flag, this.quickSort(right));
    },
    //Object array sorted by attribute name
    objectSort: function (origin, prop) {
      let a = this.deepCopy(origin);
      //conversion type
      for (let i = 0; i < a.length; i++) {
        if (!isNaN(parseFloat(a[i][prop]))) {
          a[i][prop] = parseFloat(a[i][prop]);
        }
      }
      //end condition
      if (a.length <= 1) {
        return a;
      }
      let flagIndex = Math.floor(a.length / 2);
      let flag = a.splice(flagIndex, 1)[0];
      let left = [];
      let right = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i][prop] < flag[prop]) {
          left.push(a[i]);
        } else {
          right.push(a[i]);
        }
      }
      return this.objectSort(left).concat(flag, this.quickSort(right));
    },
    //Get the current date string function
    getDate: function () {
      var a = new Date();
      var year = a.getFullYear();
      var month = a.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      var date = a.getDate();
      if (date < 10) {
        date = '0' + date;
      }
      var b = year + '-' + month + '-' + date;
      return b;
    },
    processJson(json) {
      const copyJson = JSON.parse(JSON.stringify(json));
      this.deleteAdditionalFields(copyJson);
      return copyJson
    },
    deleteAdditionalFields(nodeDetails) {
      const tagName = nodeDetails.xtag;
      delete nodeDetails.nodeId;
      delete nodeDetails.childFrequency;
      if (nodeDetails.xtagNew) delete nodeDetails.xtagNew;
      if (!nodeDetails[tagName].length) return;
      for (const childNode of nodeDetails[tagName]) {
        this.deleteAdditionalFields(childNode);
      }
    },
    async saveContent() {
      let result = this.processJson(this.xmlObject);
      let parser = new JsonToXml();
      result = parser.parse(result);
      this.formattedXml = xmlFormatter(result, { indentation: '  ' });
      // Specify the desired indentation level here
      // let finalcontent = result
      let fileSaveObj = {
        path: this.currentfilePath,
        content: this.formattedXml
      }
      await this.$store.getters.client
        .post(`/orguser/workspace/savefilecontent`, fileSaveObj)
        .then((res) => {
          console.log(res),
          this.showCommitBtn = true
          this.messageToast(
            "Success",
            "success",
            "Your changes have been saved successfully into your workspace."
          );
        })
        .catch((err) => {
          console.log(err)
        })
    },
  }
}
</script>
<style scoped>
.icon-cog {
  color: #061873;
}

.headButton {
  position: relative;
  display: inline-block;
  background: #021559;
  border: 1px solid #99D3F5;
  border-radius: 4px;
  padding: 15px 5px 5px 5px;
  overflow: hidden;
  color: white;
  text-decoration: none;
  text-indent: 0;
  line-height: 0rem;
  cursor: pointer;
  box-shadow: 0.1rem 0.1rem 0.5rem lightgray;
}

.headButton:hover {
  background-color: rgb(173, 216, 250);
}

.headButton input {
  position: absolute;
  font-size: 2rem;
  right: 0;
  top: 0;
  opacity: 0;
}


#tags {
  margin-left: 1rem;
  position: absolute;
  left: 0;
  right: 0.5rem;
  min-width: 10rem;
  top: 0rem;
  bottom: 0rem;
  overflow: auto;
  min-height: 30rem;
  /* box-shadow: 0 0 1rem lightgrey; */
  width: 40rem;
}

#tags::-webkit-scrollbar {
  width: 0.4rem;
  height: 0.4rem;
}

#tags::-webkit-scrollbar-thumb {
  border-radius: 1rem;
  background-color: #021559;
}

#tags::-webkit-scrollbar-track {
  border-radius: 0.5rem;
  background-color: white;
}



/* #attributes{
    position: absolute;
    width: 16.5rem;
    left: 0;
    top: 0rem;
    bottom: 0rem;
    min-height: 30rem;
    box-shadow: 0rem 0rem 1rem lightgrey;
} */
/*attributes item style*/
#attributeList {
  margin-left: 0.5rem;
}

.attributeDiv p {
  border-left: solid #021559;
  padding-left: 0.5rem;
  margin-right: 0.5rem;
  padding-right: 0.5rem;
  height: 2rem;
  line-height: 2rem;
  max-width: 12.5rem;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
}

.attributeDiv:hover {
  background-color: rgba(173, 216, 230, 0.8);
}

.attributeDiv p {
  margin: 0rem;
}

#attributeTitle {
  height: 2.5rem;
  line-height: 2rem;
  font-size: 1.5rem;
  text-align: center;
  padding: 0.25rem 0 0.25rem 0;
  background-color: #021559;
  color: white;
}

#attributesWrapper {
  bottom: 0rem;
  /* position: absolute; */
  top: 2.5rem;
  right: 0rem;
  left: 0rem;
  min-height: 25rem;
  overflow: auto;
}

#attributesWrapper::-webkit-scrollbar {
  width: 0.4rem;
  height: 0.4rem;
}

#attributesWrapper::-webkit-scrollbar-thumb {
  border-radius: 1rem;
  background-color: #021559;
}

#attributesWrapper::-webkit-scrollbar-track {
  border-radius: 0.5rem;
  background-color: white;
}

#newAttribute {
  text-align: center;
  font-size: 20px;
}

#newAttribute:hover {
  background: #e3e3e3;
}

.heading {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between
}

.test {
  height: 500px !important;
}



.bg-card {
  background-color: #3F979B !important;
}



.currentfilePath-path {
  display: flex;
  align-items: center;
}

.currentfilePath-path-icon {
  margin-right: 5px;
  font-size: 1.2rem;
}

p {
  margin-top: -21px !important;
  margin-bottom: 1rem !important;
}

.currentfilePath-path-items {
  display: flex;
  align-items: center;
}

.currentfilePath-path-item {
  margin-right: 5px;
  font-size: 0.875rem;
  color: #000000;
  user-select: none;
}


/* .currentfilePath-path-item:hover {
  color: #000000;
  text-decoration: underline;
} */

.currentfilePath-path-separator {

  color: #6c757d;
}


.truncated-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 45vw;

}

.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  background-color: rgb(153, 177, 255) !important;
  color: #fff !important;
}
</style>