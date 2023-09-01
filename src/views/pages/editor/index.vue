<template>
  <simplebar style="background-color: white ;height: 100vh; margin: 0; padding: 0;" class="m-0 p-0">
    <navbar />
    <hr />
    <div v-if="textVisible">
      <Toolbar :ditaot="ditaotVersion" :xmlObject="xmlObject" />
    </div>
    <div v-if="!textVisible">
      <div class="toolbar">
        <div class="btn-group mr-2 mb-2 mb-sm-0 btn-toolbar p-0">
          <h5>You are in read-only mode. Any changes or edits made will not happen.</h5>
        </div>
      </div>
    </div>
    <hr />
    <div class="container-fluid p-0 m-0" style="background-color: #fff">
      <div class="row no-gutters" style="position: sticky;">
        <div class="col-md-3 col-sm-12">
          <div v-if="model !== null">
            <div>
              <b-card>
                <h5 slot="header" class="mb-0 text-center">
                  <span class="d-flex align-items-center justify-content-center">
                    <span class="mr-1">
                      <img style="height: 20px; padding: 0px;" src="../../../assets/toolbarsvgs/ditamaps.svg"
                        alt="SVG Image" />
                    </span>
                    <span>DITAMAPS</span>
                  </span>
                </h5>
                <hr />
                <div class="tree-rows">
                  <simplebar style="height: 75vh">
                    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
                      <span class="d-flex align-items-center mt-1">
                        <span class="folder-icon " v-if="isFolder"> {{ isOpen ? "▶" : "▼" }} </span>
                        <i class="fas fa-folder icon-cog" v-if="isFolder"></i>
                        <i class="fas fa-file-alt icon-cog" v-else></i>
                        <span class="truncated-path">{{ model.name }}</span>
                      </span>
                    </div>
                    <div v-show="isOpen" v-if="isFolder" style="height: 70vh " class="mt-1 tree">
                      <TreeItem class="item treeItems " v-for="model in model.children" :key="model.id" :model="model">
                      </TreeItem>
                    </div>
                  </simplebar>
                </div>
              </b-card>
            </div>
          </div>
        </div>
        <div v-if="textVisible" class="col-md-6 col-sm-12">
          <div>
            <b-card>
              <div slot="header" class="row">
                <div class="col-md-12">
                  <div class="d-flex justify-content-between ">
                    <button v-b-tooltip.hover title="Switch to Text View" type="button" @click="toggleView" class="btn">
                      <img style="height: 25px; padding: 0px;" src="../../../assets/toolbarsvgs/ide.svg"
                        alt="SVG Image" />
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <div style="overflow-y: scroll; height: 75vh;   ">
                <div v-if="!xmlObject.html" style=" font: 12pt">
                  <div class="editor-page">
                    <div class="pl-2 pb-2 pr-2 py-2  mx-2">
                      <recursive-tag :parentTagHistory="[]" :selectedTag="selectedTag" :errorMessage="errMessage"
                        :data="xmlObject" :peers="[]" :self="0"></recursive-tag>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center">
                  <div class="d-flex justify-content-center">
                    <div class="position-relative">
                      <img style="height: 250px; margin-bottom: 10px;" src="../../../assets/placeholder.png"
                        alt="Placeholder Image" />
                      <div style="bottom: 0; left: 0; right: 0; color: #666; font-size: 20px;">
                        {{ errMessage || "Please select a valid XML file." }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </b-card>
          </div>
        </div>
        <div v-if="!textVisible" class="col-md-9 col-sm-12">
          <b-card>
            <div slot="header" class="row">
              <div class="col-md-12">
                <div class="d-flex justify-content-between">
                  <div>
                  </div>
                  <button v-b-tooltip.hover title="Switch to Tag View" type="button" @click="toggleView" class="btn">
                    <img style="height: 20px; padding: 0px;" src="../../../assets/toolbarsvgs/authar.svg"
                      alt="SVG Image" />
                  </button>
                </div>
              </div>
            </div>
            <div style="height: 75vh;;">
              <div v-if="!xmlObject.html" class="pl-2 pb-2 pr-2  mx-2">
                <TextView :rootContent="rootContent" :data="xmlObject || xmlObjectold" :errorMessage="errMessage" />
              </div>
              <div v-else class="text-center">
                <div class="d-flex justify-content-center">
                  <div class="position-relative">
                    <img style="height: 250px; margin-bottom: 10px;" src="../../../assets/placeholder.png"
                      alt="Placeholder Image" />
                    <div style="bottom: 0; left: 0; right: 0; color: #666; font-size: 20px;">
                      {{ errMessage || "Please select a valid XML file." }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-card>
        </div>
        <div v-if="textVisible" class="col-md-3 col-sm-12">
          <b-card>
            <b-tabs justified nav-class="nav-tabs-custom" content-class="text-muted" style="height: 82vh;">
              <b-tab title="Add Child Tag" active>
                <div>
                  <div v-if="model !== null">
                    <EditTag :errorMessage="errMessage" :data="xmlObject" />
                  </div>
                </div>
              </b-tab>
              <b-tab title="Add Attribute">
                <div>
                  <div v-if="model !== null">
                    <Attribute :errorMessage="errMessage" :data="xmlObject" />
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
      </div>
    </div>
    <div>
      <b-modal v-model="pullReqModal" id="modal-center" centered hide-footer title='Action Required'>
        <p>You will need to Create a Pull Request
          We noticed that your repository is currently behind the latest changes. To ensure that your code is up to date
          and aligned with the latest developments, we recommend following these steps:
          <br />
          <code>1.</code>Create a Pull Request by clicking the “Pull request button from the toolbar” to compare your code
          with the
          latest changes. This step is crucial to review and integrate your work seamlessly.
          <br />
          <code>2.</code>Review and Commit:
          Once the pull request is open, take your time to review the changes and address any conflicts. This ensures that
          your code works harmoniously with the updated codebase. Once everything looks good, you can proceed to commit
          your changes.
          <br />
          Remember, pull requests are an essential part of our collaborative development process, enabling us to maintain
          code quality and stay in sync with ongoing developments.
        </p>
      </b-modal>
    </div>
  </simplebar>
</template>
<script>
import TextView from "./components/textView.vue";
import Attribute from "./components/attribute.vue";
import EditTag from "./components/edittag.vue";
import Toolbar from "./components/toolbar.vue";
import _ from "lodash";
import { JsonToXml } from "./convert.js";
import Swal from "sweetalert2";
import RecursiveTag from "./components/recuresivetag.vue";
import TreeItem from "./components/treeitems.vue";
import { eventBus } from "../../../main";
// import xmlFormatter from "xml-formatter";
import { BTabs, BTab } from 'bootstrap-vue'
import navbar from "./components/navbar.vue";
import simplebar from "simplebar-vue";
import xmlFormat from 'xml-formatter';
// import { elementFromString } from "@tiptap/vue-2";
export default {

  data() {
    return {
      historyObject: [],
      futureObject: [],
      changesMade: false,
      xmlOutput: "",
      showEditOption: true,
      showAttr: false,
      errMessage: null,
      componentVisible: true,
      editComponentVisible: true,
      textVisible: true,
      pullReqModal: false,
      title: "DocEditor",
      tagSelected: false,
      items: [
        {
          text: "Projects",
          href: `/docmanager`,
        },
        {
          text: "DocEditor",
          active: true,
        },
      ],
      xmlObjectold: {
        xtag: "Root",
        Root: [], // the initial tag's childnodes array object
      },
      xmlObject: {
        xtag: "Root",
        Root: [], // the initial tag's childnodes array object
      },
      modalVisible: false,
      names: "",
      lastSaved: "N/A",
      timerId: null,
      nameState: null,
      submittedNames: [],
      isLoading: false,
      clickedTag: {},
      isAddAttr: false,
      newAttrName: "newName",
      newAttrValue: "newValue",
      fileSHA: null,
      model: null,
      isOpen: true,
      fileContent: null,
      currentfilePath: null,
      localRepoPath: null,
      commitMsg: null,
      ditaotVersion: "",
      showAlert: false,
      isDocPublisher: null,
      xtag: null,
      text: null,
      showComponentA: true,
      getdatafromsessionStorage: false,
      showCommitBtn: false,
      showSaveContentBtn: false,
      intervalId: null,
      formattedXml: "",
      projectName: `${this.$route.params.reponame}`,
      selectedTag: '',
      xmlfile: '',
      oldXmlValue: null,
      rootContent: '',
      unsavedChanges: false,
    };
  },
  components: {
    simplebar,
    RecursiveTag,
    TreeItem,
    navbar,
    TextView,
    Toolbar,
    Attribute,
    EditTag,
    BTabs,
    BTab,
  },
  created() {
    this.readXML();
    eventBus.$on('clear-Data', () => {
      this.selectedTag = '',
        eventBus.$emit('validTagSelected', false)
    })
    eventBus.$on('nodeIdUpdate', (newxtag, newNodeId) => {
      this.selectedTag = newNodeId
      eventBus.$emit('generateTextList', newxtag, newNodeId)
    })
    eventBus.$on('validTagSelected', (flag) => {
      this.tagSelected = flag;
    });
    eventBus.$on('undoChanges', () => {
      this.undo()
    });
    eventBus.$on('redoChanges', () => {
      this.redo()
    });
    window.addEventListener('beforeunload', this.checkUnsavedChanges);

    this.getOrgDetails();
    eventBus.$on('selectedTagData', (nodeId) => {
      this.selectedTag = nodeId
    })
    eventBus.$on("clicktag", async (data) => {
      let keys = Object.keys(data);
      this.$refs.editmodal.show();
      delete data[keys[keys.length - 1]];
      this.clickedTag = data;
    });
    eventBus.$on("edit", async (data) => {
      this.editAttribute(data);
      this.$refs.editmodal.hide();
      this.showAlert = true;
    });
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  mounted() {

    eventBus.$on("saveContentEditor", () => {
      this.saveContent()
    });
    eventBus.$on('saveRecord', () => {
      this.record()
    });
    eventBus.$on('clearHistory', () => {
      this.historyObject = [],
        this.futureObject = []
    });
    eventBus.$on("githubCommit", this.githubCommit);
    this.getfoldertree();
    let that = this;
    this.$nextTick(() => {
      eventBus.$emit("xmlData", that.xmlObject);
    });
    eventBus.$on("body-updated", (body) => {
      body.nodeDetails = this.xmlObject;
      this.body = body;
      if (this.body) {
        this.$store.getters.client
          .post("/orguser/doceditor/editXml", this.body)
          .then((res) => {
            console.log("res", res);
            let updatedData = res.data;
            localStorage.setItem("xmlObject", JSON.stringify(updatedData));
            this.xmlObject = JSON.parse(localStorage.getItem("xmlObject"));
            eventBus.$emit('saveRecord')
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    });
    eventBus.$on("add-link", (body) => {
      body.nodeDetails = this.xmlObject;
      this.body = body;
      if (this.body) {
        this.$store.getters.client
          .post("/orguser/doceditor/editXml", this.body)
          .then((res) => {
            console.log("res", res);
            let updatedData = res.data;
            localStorage.setItem("xmlObject", JSON.stringify(updatedData));
            this.xmlObject = JSON.parse(localStorage.getItem("xmlObject"));
            eventBus.$emit('saveRecord')
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    });
    eventBus.$on("add-img", (body) => {
      body.nodeDetails = this.xmlObject;
      body.editDetails.filePath = this.currentfilePath
      console.log(body);
      if (body) {
        this.$store.getters.client
          .post("/orguser/doceditor/editXml", body)
          .then((res) => {
            console.log("res", res);
            let updatedData = res.data;
            localStorage.setItem("xmlObject", JSON.stringify(updatedData));
            this.xmlObject = JSON.parse(localStorage.getItem("xmlObject"));
            eventBus.$emit('saveRecord')
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    });
    eventBus.$on("valuechange", function () {
      sessionStorage.setItem("xmlObject", JSON.stringify(that.xmlObject));
    });
    eventBus.$on("add-attribute", function () {
      sessionStorage.setItem("xmlObject", JSON.stringify(that.xmlObject));
    });
    eventBus.$on("get-data", function (data) {
      that.xmlObject = data;
    });
    eventBus.$on("click-tag", function (data) {
      that.clickedTag = data;
    });
    eventBus.$on("clear-attributes", function () {
      that.clickedTag = {};
    });
    document.addEventListener("keydown", this.handleKeyDown);
    this.getDitaOt();
  },

  computed: {
    isFolder() {
      return this.model.children && this.model.children.length;
    },
    _() {
      return _;
    },
  },
  watch: {
    historyObject: {
      handler() {
        if (this.historyObject.length === 0) {
          eventBus.$emit('historyObjectChanged', true);
        } else {
          eventBus.$emit('historyObjectChanged', false);
        }
      },
      deep: true,
    },
    futureObject: {
      handler() {
        if (this.futureObject.length === 0) {
          eventBus.$emit('futureObjectChanged', true);
        } else {
          eventBus.$emit('futureObjectChanged', false);
        }
      },
      deep: true,
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
    markChanges() {
      this.unsavedChanges = true;
    },
    clearChanges() {
      this.unsavedChanges = false;
    },

    checkUnsavedChanges(event) {
      if (this.unsavedChanges) {
        event.returnValue = 'Changes you made may not be saved.';
      }
    },
    handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        // Ctrl+Z pressed (undo)
        event.preventDefault();
        this.undo();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "y") {
        // Ctrl+Y pressed (redo)
        event.preventDefault();
        this.redo();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        // Ctrl+S pressed (save)
        event.preventDefault();
        this.saveContent();
      }
    },

    record() {
      this.markChanges()
      let a = this.deepCopy(this.xmlObject);
      this.historyObject.push(a);
      this.futureObject = [];
      if (this.historyObject.length > 10) {
        this.historyObject.shift();
      }
      this.changesMade = false;
    },
    undo() {
      this.undoTriggered = true
      if (this.historyObject.length === 0) {
        // alert("No history found!");
        return;
      }
      let previousState = this.historyObject.pop();
      console.log(previousState)
      if (previousState === null || previousState.xtag === "html") return
      this.futureObject.push(this.deepCopy(this.xmlObject));
      this.xmlObject = previousState;
    },
    redo() {
      if (this.futureObject.length === 0) {
        return;
      }
      let nextState = this.futureObject.pop();
      this.historyObject.push(this.deepCopy(this.xmlObject));
      this.xmlObject = nextState;
    },
    textSync() {
      eventBus.$emit('toggleSync');
      eventBus.$emit('saveRecord')
    },
    showAttribute() {
      this.showAttr = true;
      this.showEditOption = false;
    },
    showEdit() {
      this.showEditOption = true;
      this.showAttr = false;
    },
    toggleComponent() {
      this.componentVisible = !this.componentVisible;
      this.getcontent();
    },
    toggleEdit() {
      this.editComponentVisible = !this.editComponentVisible;
    },
    toggleView() {
      this.textVisible = !this.textVisible;
      eventBus.$emit('rootContent', this.rootContent)
      eventBus.$emit("clear-Data");
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
          return value.trim() !== ""
            ? undefined
            : "Please enter a commit message.";
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
              console.log(res);
              this.showCommitBtn = false;
              Swal.fire({
                icon: "success",
                title: "Commit request completed successfully!",
                text: res.data.message,
              });
              console.log("working!!");
            })
            .catch((err) => {
              console.log(err);
              if (err.response.data.message === "Please pull your project first!") {
                this.pullReqModal = true
              }
              else {
                Swal.fire({
                  icon: "error",
                  title: "Commit failed!",
                  text: err.response.data.message,
                });
              }


            });
        }
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
    async getDitaOt() {
      this.getOrgId = window.localStorage.getItem("orgId");
      await this.$store.getters.client
        .get(`/serveradmin/organization/byorgid?orgId=${this.getOrgId}`)
        .then((response) => {
          this.ditaotVersion = response.data[0].ditaotVersion;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    controlcommitbtn() {
      this.$refs.viewDetailsModel.show();
    },
    async getcontent() {
      eventBus.$on("getcontent", (data) => {
        this.fileContent = data.content;
        this.currentfilePath = data.path;
        let fileContentObjn = data.content;
        let domParser = new DOMParser();
        let xmlDom = domParser.parseFromString(
          fileContentObjn,
          "application/xml"
        );
        if (typeof fileContentObjn === 'object') {
          sessionStorage.setItem("xmlObject", JSON.stringify(''));
          this.xmlObject = JSON.parse(sessionStorage.getItem("xmlObject"));
          this.errMessage = "Please select a valid XML file."
          return
        } else {
          let rootElement = xmlDom.documentElement;
          this.rootContent = fileContentObjn.split(`<${rootElement.nodeName}`)[0]
          eventBus.$emit('rootContent', this.rootContent)

          this.preProcess(xmlDom);
          this.xmlObjectold = null;
          if (!this.getdatafromsessionStorage) {
            this.xmlObjectold = this.xmlDomToJson(xmlDom.childNodes[0]);
          } else {
            this.xmlObjectold = sessionStorage.getItem();
          }
          this.xmlObjectold = this.xmlDomToJson(xmlDom.childNodes[0]);
          const body = {
            nodeDetails: this.xmlObjectold,
          };
          if (!data.path) return;
          let loader = this.$loading.show({
            loader: "dots",
          });
          this.$store.getters.client
            .post(`/orguser/doceditor/generateNodeId`, body)
            .then((res) => {
              this.errMessage = res.data;
              sessionStorage.setItem("xmlObject", JSON.stringify(res.data));
              this.xmlObject = JSON.parse(sessionStorage.getItem("xmlObject"));
              this.sendData();
              loader.hide()
            })
            .catch((err) => {
              this.errMessage = err.response.data.message;
              loader.hide()
            });
          this.$emit("get-data", this.xmlObject);
        }
      });
    },

    sendData() {
      let that = this;
      eventBus.$emit("xmlData", that.xmlObject);
    },
    convertXmlObjectToXml() {
      let xmlString = this.convertToXml(this.xmlObject);
      console.log("converted XMl", xmlString);
      return xmlString;
    },
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    remove() {
      eventBus.$emit("edit", {
        editWay: "remove",
        name: this.name,
        value: this.value,
      });
    },
    changeType() {
      if (!this.isFolder) {
        this.model.children = [];
        this.addChild();
        this.isOpen = true;
      }
    },

    async getfoldertree() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      await this.$store.getters.client
        .get(
          `/orguser/workspace/byuserId?userId=${localStorage.getItem("userId")}`
        )
        .then(async (res) => {
          let path = res.data.installedPath + `/${this.$route.params.reponame}`;
          this.localRepoPath =
            res.data.installedPath + `/${this.$route.params.reponame}`;
          await this.$store.getters.client
            .get(`/orguser/workspace/repotree?path=${path}`)
            .then((tres) => {
              loader.hide()
              this.model = tres.data;
            })
            .catch((err) => {
              loader.hide()
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async readXML() {
      await this.getcontent();
      let fileContentObjn = this.fileContent;
      let that = this;
      let domParser = new DOMParser();
      let xmlDom = domParser.parseFromString(
        fileContentObjn,
        "application/xml"
      );
      that.preProcess(xmlDom);
      that.xmlObject = null;
      that.xmlObject = that.xmlDomToJson(xmlDom.childNodes[0]);
      if (that.xmlObject.html && that.xmlObject.text) {
        return;
      }
      that.$emit("get-data", that.xmlObject);
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
      if (xml.nodeType !== 1) {
        return null;
      }

      let obj = {};
      obj.xtag = xml.nodeName;

      // Process the text content if present
      // let nodeText = (xml.textContent || "").replace(/(\r|\n)/g, "").trim();
      // if (nodeText) {
      //   obj.text = nodeText;
      // }

      // Convert the XML element's attributes
      if (xml.attributes.length > 0) {
        for (let i = 0; i < xml.attributes.length; i++) {
          let attribute = xml.attributes[i];
          obj[attribute.nodeName] = attribute.nodeValue;
        }
      }

      // Convert the XML element's childNodes
      let items = [];
      for (let i = 0; i < xml.childNodes.length; i++) {
        let node = xml.childNodes[i];
        if (node.nodeType === 1) {
          let item = this.xmlDomToJson(node); // Call recursion to convert childNodes
          if (item) {
            items.push(item);
          }
        } else if (node.nodeType === 3) {
          let text = (node.textContent || "").replace(/(\r|\n)/g, "").trim();
          if (text) {
            items.push(text);
          }
        }
      }
      if (items.length > 0) {
        obj[obj.xtag] = items;
      }
      return obj;
    },
    getData(data) {
      this.clickedTag = data;
      console.log(this.clickedTag);
    },
    sendTextAjax: function (interfacever, sendData, func) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "";
      //get and process data
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
          xhr.setRequestHeader("If-Modified-Since", "0");
          xhr.setRequestHeader("Cache-Control", "no-cache");
          xhr.setRequestHeader("Content-Type", "application/json");
        }
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.statuss == 304) {
            let data = xhr.response;
            if (func) {
              func(data);
            }
          } else {
            if (interfacever.alertMessage) {
              alert(interfacever.alertMessage + " " + xhr.status);
            }
          }
        }
      };
      //send data
      if (typeof sendData == "object") {
        sendData = JSON.stringify(sendData);
      }
      if (interfacever.type == "GET" || interfacever.type == "get") {
        xhr.open("GET", interfacever.url + "?data=" + sendData, true);
      } else {
        xhr.open("POST", interfacever.url, true);
      }
      xhr.send(sendData);
    },
    //deep copy of array and object
    deepCopy: function (origin) {
      return JSON.parse(JSON.stringify(origin))
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
        month = "0" + month;
      }
      var date = a.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      var b = year + "-" + month + "-" + date;
      return b;
    },
    processJson(json) {
      const copyJson = JSON.parse(JSON.stringify(json));
      this.deleteAdditionalFields(copyJson);
      return copyJson;
    },
    deleteAdditionalFields(nodeDetails) {
      if (typeof nodeDetails === "string") return;
      const tagName = nodeDetails.xtag;
      delete nodeDetails.nodeId;
      delete nodeDetails.childFrequency;
      if (nodeDetails.xtagNew) delete nodeDetails.xtagNew;
      if (!nodeDetails[tagName] || !nodeDetails[tagName].length) return;
      for (const childNode of nodeDetails[tagName]) {
        this.deleteAdditionalFields(childNode);
      }
    },
    // formattedXmlText() {
    //   let result = this.processJson(this.xmlObject);
    //   let parser = new JsonToXml();
    //   result = parser.parse(result);
    //   this.formattedXml = xmlFormatter(result, { indentation: "  " });
    // },
    async saveContent() {
      if (document.getElementsByClassName("toast").length) {
        return
      }
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.clearChanges();
      let result = this.processJson(this.xmlObject);
      let parser = new JsonToXml();
      result = parser.parse(result);
      this.formattedXml = result;
      const xmlWithRoot = this.rootContent + xmlFormat(this.formattedXml, {
        indentation: '  ',
        filter: (node) => node.type !== 'Comment',
        collapseContent: true,
        lineSeparator: '\n'
      });
      let fileSaveObj = {
        path: this.currentfilePath,
        content: xmlWithRoot,
      };
      await this.$store.getters.client
        .post(`/orguser/workspace/savefilecontent`, fileSaveObj)
        .then((res) => {
          console.log("fdfgddfs", res),
            this.showCommitBtn = true;
          loader.hide()
          this.messageToast(
            "Success",
            "success",
            "Your changes have been saved successfully into your workspace."
          );
        })
        .catch((err) => {
          loader.hide()
          this.messageToast(
            "Request failed",
            "danger",
            err
          );
        });
    },
  },
};
</script>
<style scoped>
.folder-icon {
  font-size: 11px;
  width: 11px;
  color: #1C274C;
  margin-right: 0.2rem;
}

.icon-cog {
  color: #1C274C;
}

.headButton {
  position: relative;
  display: inline-block;
  background: #021559;
  border: 1px solid #99d3f5;
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

.heading {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.test {
  height: 500px !important;
}

.bg-card {
  background-color: #3f979b !important;
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
  color: #1C274C;
  font-family: sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 1px);
  padding-left: 8px;
}

.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  background-color: rgb(153, 177, 255) !important;
  color: #fff !important;
}

.card {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(198, 198, 198, 1);
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: rgba(198, 198, 198, 1);
  /* border-right-width: 1px;
  border-right-style: solid;
  border-right-color: rgba(198, 198, 198, 1); */
  /* border-top-width: 1px; */
  /* border-top-style: solid;
  border-top-color: rgba(198, 198, 198, 1); */
  background-color: white;
}

.b-navbar {
  border: 1px solid rgba(198, 198, 198, 1);
  background-color: white;
}

.tree-rows {
  padding-left: 10px;
  padding-top: 0px;
}

hr {
  margin-top: 0rem;
  margin-bottom: 0rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.tree-header {
  background-color: #fff;
  padding: 10px;
  font-weight: 900;
  font: bolder;
}

.navigation-rail__header {
  display: flex;
  align-items: center;
  padding: 30px 12px;
  font-size: 1.2em;
  color: #292929;
  font-weight: 700;
  font-family: robotolight, Arial, Helvetica, sans-serif;
  height: 57px;
  border-bottom: 1px solid #dcdcdc;
}




.card {
  border-radius: 0;
}

.doc-header {
  border-bottom-width: 1px;
  border-radius: 0;
  border-bottom-style: solid;
  border-bottom-color: rgba(198, 198, 198, 1);
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: rgba(198, 198, 198, 1);
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: rgba(198, 198, 198, 1);
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgba(198, 198, 198, 1);
  background-color: #e8e8e8;
  padding: 2rem;
  background-color: #fbfbfb;
}

.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 0rem !important;
}

.navigation-rail__tab--selected {
  background-color: #f5f5f5;
  left: 0;
}

.dita-map-view-map {
  width: -webkit-calc(100% - 24px);
  width: calc(100% - 24px);
  margin: 12px;
  overflow: hidden;
  position: absolute;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 40px 10px 12px;
  background-color: #f5f5f5;
  border: 1px solid #dcdcdc;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
}

.col-md-2.attribute {
  height: 100vh;
}

.sidebar-btn.active {
  background-color: #252b3b !important;
  color: white;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 900px;
}

#page-topbar1 {
  position: relative;
  top: 0vh;
  right: 0;
  left: 0;
  /* z-index: 100; */
  background: #ffffff;
  background-color: #ffffff;
  border-top: 1px solid #dcdcdc;

}

.editor {
  width: 100%;
  height: 100%;
  margin: 0;
  outline: none;
  background-color: #fff;
}

#docs-primary-toolbars {
  display: block;
}

.toolbar {
  background-color: #f1f5f7;
  border-radius: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.truncated-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 1px);
  /* Adjust the padding value to create the desired distance */
  padding-left: 8px;
  /* Adjust the padding value to create the desired distance */
}

.editor-page {
  margin-left: 1rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-right: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border: 1px #D3D3D3 solid;
  min-height: 256mm;
}

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
</style>
