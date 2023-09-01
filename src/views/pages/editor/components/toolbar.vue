<template>
  <div>

    <!-- <header id="page-topbar1"> -->
    <div class="toolbar">
      <div class="btn-group mr-2 mb-2 mb-sm-0 btn-toolbar p-0">
        <!-- <div class="d-flex align-items-center"> -->
        <button type="button" class="btn btn-light" v-b-tooltip.hover title="Commit on Github" v-if="disabledGithub"
          id="github" variant="light" @click="githubCommit()" disabled>
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/github.svg" alt="SVG Image" />
        </button>
        <button type="button" class="btn btn-light" v-b-tooltip.hover title="Commit on Github" v-else id="github"
          variant="light" @click="githubCommit()" :disabled="disabledGithub">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/github.svg" alt="SVG Image" />
        </button>
        <button type="button" class="btn btn-light" v-b-tooltip.hover title="Save document (Ctrl+S)" id="save"
          variant="light" @click="saveContent()" :disabled="disableSave">
          <img style="height: 27px; padding: 0px;" src="../../../../assets/toolbarsvgs/save.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Make your text bold" id="bold" type="button" :class="[
          'btn',
          'btn-light',
          { 'custom-background-class': isBoldBackgroundChanged },
        ]" @click="toggleBold" variant="light" :disabled="disableBoldButton">
          <span>
            <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/format-bold.svg"
              alt="SVG Image" />
          </span>
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Italicize your text." id="italic" type="button" :class="[
          'btn',
          'btn-light',
          { 'custom-background-class': isItalicBackgroundChanged },
        ]" @click="toggleItalic" variant="light" :disabled="disableItalicButton">
          <span>
            <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/format-italic.svg"
              alt="SVG Image" />
          </span>
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Underline your text." id="Underline" type="button" :class="[
          'btn',
          'btn-light',
          { 'custom-background-class': isUnderlineBackgroundChanged },
        ]" @click="toggleUnderline" variant="light" :disabled="disableUderlineButton">
          <span :class="{ 'custom-underline': isUnderline }">
            <img style="height: 25px; padding: 0px ;" src="../../../../assets/toolbarsvgs/format-underline.svg"
              alt="SVG Image" />
          </span>
        </button>

        <button class="btn btn-light" v-b-tooltip.hover title="Insert Ordered List" id="OrderedList" variant="light"
          @click="toggleOl()" style="max-height: 5rem;" :disabled="disableOlButton" :class="[
            'btn',
            'btn-light',
            { 'custom-background-class': isOlBackgroundChanged },]">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/ol.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Insert Unordered List" id="UnOrderedList" variant="light"
          @click="toggleUl()" style="max-height: 5rem;" :disabled="disableUlButton" :class="[
            'btn',
            'btn-light',
            { 'custom-background-class': isUlBackgroundChanged },]">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/ul.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Insert list item" id="addList" variant="light"
          @click="toggleAddList()" style="max-height: 5rem;" :disabled="disableAddListButton" :class="[
            'btn',
            'btn-light',
          ]">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/addList.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Insert Table" id="table" variant="light"
          @click="opentableModal()" style="max-height: 5rem;" :disabled="disableTableButton">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/table.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Insert Image" id="Image" variant="light"
          @click="openImageModal()" style="max-height: 5rem;" :disabled="disableImageButton">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/img.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Insert Link" id="Link" variant="light" @click="addChild()"
          style="max-height: 5rem;" :disabled="disableLinkButton">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/link.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Undo (Ctrl+Z)" id="undo" variant="light" @click="undo()"
          style="max-height: 5rem;" v-if="!disableUndoBtn">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/undo.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-if="disableUndoBtn" id="undo" variant="light" style="max-height: 5rem;"
          :disabled="disableUndoBtn">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/undo.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-b-tooltip.hover title="Redo (Ctrl+Y)" id="redo" variant="light" @click="redo()"
          style="max-height: 5rem;" v-if="!disableRedoBtn">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/redo.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" id="redo" variant="light" style="max-height: 5rem;" v-if="disableRedoBtn"
          :disabled="disableRedoBtn">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/redo.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-if="!disableDelete" v-b-tooltip.hover title="Delete Selected Tag" id="delete"
          variant="light" @click="deleteTag()" style="max-height: 5rem;">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/delete.svg" alt="SVG Image" />
        </button>
        <button class="btn btn-light" v-if="disableDelete" v-b-tooltip.hover title="Delete Selected Tag" id="delete"
          variant="light" style="max-height: 5rem;" :disabled="disableDelete">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/delete.svg" alt="SVG Image" />
        </button>
        <!-- <button class="btn btn-light " @click="createPullreq()" v-b-tooltip.hover title="Create Github Pull Request"
          id="delete" variant="light" style="max-height: 5rem;">
          <img style="height: 25px; padding: 0px;" src="../../../../assets/toolbarsvgs/pullRepo.svg" alt="SVG Image" />
        </button> -->
        <input accept=".jpg,.jpeg,.png,.gif" type="file" class="form-control-file" id="logo-image" name="logo-image"
          ref="fileInput" @change="onFileSelected" style="display: none;" />
      </div>
      <div>
        <b-modal v-model="tableModalVisible" id="table-modal-center" centered title="Insert Table" title-class="font-18"
          hide-footer>
          <Table :tagData="tagData"></Table>
          <b-button variant="secondary" class="mr-2" @click="cancelTable">Cancel</b-button>
          <b-button variant="primary" @click="saveTable">Save</b-button>
        </b-modal>
      </div>
    </div>
    <!-- </header> -->
  </div>
</template>
<script>
import { eventBus } from "../../../../main";
import Swal from "sweetalert2";
import Table from "./table.vue";
import schema from "../../../../assets/schema.js";
export default {
  components: {
    Table,
  },
  data() {
    return {
      textData: "",
      disableSave: true,
      disabledGithub: true,
      disableDelete: true,
      disableTableButton: true,
      disableBoldButton: true,
      disableItalicButton: true,
      disableUderlineButton: true,
      disableOlButton: true,
      disableUlButton: true,
      disableLinkButton: true,
      disableImageButton: true,
      disableAddListButton: true,
      updatedText: "",
      nodeId: "",
      tagData: "",
      self: 0,
      parentNodeId: "",
      tableModalVisible: false,
      olmodalVisible: false,
      ulModalVisible: false,
      linkModalVisible: false,
      imageModalVisible: false,
      replacemodalVisible: false,
      schema: {},
      value: "",
      webLink: "",
      projectName: this.$route.params.reponame,
      xml: null,
      disableUndoBtn: true,
      disableRedoBtn: true,
      selectedText: "",
      beforeSelectedText: "",
      afterSelectedText: "",
      editedString: "",
      isBold: false,
      tagName: "",
      isItalic: false,
      isUnderline: false,
      isBoldBackgroundChanged: false,
      isItalicBackgroundChanged: false,
      isUnderlineBackgroundChanged: false,
      isUlBackgroundChanged: false,
      isOlBackgroundChanged: false,
      isAddListBackgroundChanged: false,
      ancestors: null,
    };
  },
  props: {
    ditaot: {
      type: String,
      required: true,
    },
    xmlObject: {
      type: [Object, String],
      required: true,
    },
  },
  created() {
    this.getSchema();
    eventBus.$on("boldBackground", (flag) => {
      this.isBoldBackgroundChanged = flag;
    });
    eventBus.$on("italicBackground", (flag) => {
      this.isItalicBackgroundChanged = flag;
    });
    eventBus.$on("underlineBackground", (flag) => {
      this.isUnderlineBackgroundChanged = flag;
    });
    eventBus.$on("ulBackground", (flag) => {
      this.isUlBackgroundChanged = flag;
    });
    eventBus.$on("olBackground", (flag) => {
      this.isOlBackgroundChanged = flag;
    });
    eventBus.$on("addListBackground", (flag) => {
      this.isAddListBackgroundChanged = flag;
    });
    eventBus.$on("toggleBold", () => {
      this.toggleBold();
    });
    eventBus.$on("toggleItalic", () => {
      this.toggleItalic();
    });
    eventBus.$on("selected-text", this.handleSelectedText);
    eventBus.$on("futureObjectChanged", (flag) => {
      this.disableRedoBtn = flag;
    });
    eventBus.$on("clearSelectedText", (flag) => {
      if (flag) {
        this.selectedText = "";
      }
    });
    eventBus.$on("historyObjectChanged", (flag) => {
      this.disableUndoBtn = flag;
    });
    eventBus.$on("tagData-genarated", (data) => {
      data.forEach((ele) => {
        this.originalString = ele.text;
        this.nodeId = ele.nodeId;
        this.tagData = ele.data;
        this.self = ele.self;
        this.tagName = ele.e;
        this.checkvalidations();
        this.parentNodeId = ele.parentNodeId;
      });
    });
    eventBus.$on("validTagSelected", () => {
      this.disableSave = false;
      this.disableDelete = false;
    });
    eventBus.$on('validFileSelected', (flag) => {
      this.disableSave = !flag;
      this.disableDelete = true
    });
  },
  mounted() { },
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    handleSelectedText(
      selectedText,
      beforeText,
      afterText,
      mouseUpnodeId,
      mouseUpxtag,
      mouseupancestors,
      originalString,
      tagData,
      self
    ) {
      this.beforeSelectedText = beforeText;
      this.afterSelectedText = afterText;
      this.selectedText = selectedText;
      (this.nodeId = mouseUpnodeId), (this.tagName = mouseUpxtag);
      (this.ancestors = mouseupancestors), (this.tagData = tagData);
      this.self = self;
      this.originalString = originalString;
    },
    checkvalidations() {
      this.disableTableButton = this.schema[this.tagData.xtag].validChild.table
        ? false
        : true;
      this.disableBoldButton = this.schema[this.tagData.xtag]?.validChild?.b
        ? false
        : true;
      this.disableItalicButton = this.schema[this.tagData.xtag].validChild.i
        ? false
        : true;
      this.disableUderlineButton = this.schema[this.tagData.xtag].validChild.u
        ? false
        : true;
      this.disableOlButton = this.schema[this.tagData.xtag].validChild.ol
        ? false
        : true;
      this.disableAddListButton = this.schema[this.tagData.xtag].validChild.li
        ? false
        : true;
      this.disableUlButton = this.schema[this.tagData.xtag].validChild.ul
        ? false
        : true;
      this.disableLinkButton = this.schema[this.tagData.xtag].validChild.xref
        ? false
        : true;
      this.disableImageButton = this.schema[this.tagData.xtag].validChild.image
        ? false
        : true;
      switch (this.tagData.xtag) {
        case "b":
          eventBus.$emit("boldBackground", true);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          break;
        case "i":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", true);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", false);
          break;
        case "u":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", true);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", false);
          break;
        case "ul":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", true);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", false);
          this.disableUlButton = false;
          this.disableOlButton = true;
          break;
        case "ol":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", true);
          eventBus.$emit("addListBackground", false);
          this.disableOlButton = false;
          this.disableUlButton = true;
          break;
        case "image":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", false);
          this.disableImageButton = true;
          break;
        case "xref":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          this.disableLinkButton = true;
          break;
        case "li":
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", true);
          this.disableAddListButton = true;
          this.disableOlButton = false;
          this.disableUlButton = false;
          break;
        default:
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", false);
          break;
      }
    },
    getSchema() {
      this.schema = schema;
    },
    createPullreq() {
      this.$store.getters.client
        .post(`/orguser/workspace/pullGitChanges?projectName=${this.projectName}`,
        )
        .then((res) => {
          console.log('Res', res)
          this.messageToast(
            "Success",
            "success",
            "Pull request successfully completed bhai "
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
    },
    opentableModal() {
      this.tableModalVisible = true;
    },
    cancelTable() {
      this.tableModalVisible = false;
    },
    saveTable() {
      eventBus.$emit("saveTableChanges");
      eventBus.$emit("saveRecord");
      this.tableModalVisible = false;
    },
    undo() {
      eventBus.$emit("undoChanges");
    },
    redo() {
      eventBus.$emit("redoChanges");
    },
    openOlModal() {
      this.olmodalVisible = true;
    },
    cancelOl() {
      this.olmodalVisible = false;
    },
    saveOl() {
      eventBus.$emit("saveOlChanges");
      eventBus.$emit("saveRecord");
      this.olmodalVisible = false;
    },
    openUlModal() {
      this.ulModalVisible = true;
    },
    cancelUl() {
      this.ulModalVisible = false;
    },
    saveUl() {
      eventBus.$emit("saveUlChanges");
      eventBus.$emit("saveRecord");
      this.ulModalVisible = false;
    },
    openreplaceModal() {
      this.replacemodalVisible = true;
    },
    cancelreplace() {
      this.replacemodalVisible = false;
    },
    savereplace() {
      eventBus.$emit("saveUlChanges");
      eventBus.$emit("saveRecord");
      this.replacemodalVisible = false;
    },
    openLinkModal() {
      this.linkModalVisible = true;
    },
    cancelLink() {
      this.linkModalVisible = false;
    },
    saveLink() {
      eventBus.$emit("saveUlChanges");
      eventBus.$emit("saveRecord");
      this.linkModalVisible = false;
    },
    openImageModal() {
      this.$refs.fileInput.click();
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 3) {
        Swal.fire({
          icon: "error",
          title: "File size should not exceed 3 MB",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        event.target.value = null;
        return;
      }
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Only image files are allowed",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        event.target.value = null;
        return;
      }
      const formData = new FormData();
      formData.append("ditaContentImages", file);
      this.fileName = file.name;
      console.log("Selected file:", this.fileName);
      const userId = localStorage.getItem("userId");
      const orgId = localStorage.getItem("orgId");
      this.$store.getters.client
        .post(
          `/orguser/doceditor/uploadDitaContentImg?userId=${userId}&orgId=${orgId}&projectName=${this.projectName}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          this.addImg();
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    addImg() {
      const body = {
        reqType: "addDitaContentImage",
        editDetails: {
          nodeId: this.nodeId,
          xtag: "image",
          projectName: this.projectName,
          imgName: this.fileName,
        },
      };
      console.log("body", body);
      eventBus.$emit("add-img", body);
      this.selectedxtag = "";
      this.linkModalVisible = false;
      this.fileName = "";
      // this.generateNewTagList()
    },
    deleteTag() {
      eventBus.$emit("deleteTag", this.nodeId);
    },
    saveContent() {
      (this.disabledGithub = false), eventBus.$emit("saveContentEditor");
    },
    githubCommit() {
      eventBus.$emit("githubCommit");
    },
    isValidSelectedText() {
      return this.selectedText && typeof this.selectedText === "string"
    },
    clearData() {
      this.nodeId = "";
      this.originalString = "",
        this.tagData = "",
        this.self = "",
        this.tagName = "",
        this.parentNodeId = ""
    },
    toggleBold() {
      // if (this.tagData.ancestors.b && this.tagName !== "b") {
      //   this.messageToast(
      //     "Success",
      //     "info",
      //     "you cannot add bold tag inside bold tag."
      //   );
      //   return
      // }
      // else
      if (this.tagName === "b") {
        eventBus.$emit("revertToolbar", this.nodeId);
        this.clearData()
      } else if (this.isValidSelectedText()) {
        this.editedString = `<b>${this.selectedText}</b>`;
        this.xml = `<title>${this.beforeSelectedText} ${this.editedString} ${this.afterSelectedText}</title>`;
        this.readXML();
      } else if (this.originalString) {
        this.editedString = `<b>${JSON.stringify(this.originalString)}</b>`;
        this.xml = `<title>${this.editedString}</title>`;
        this.readXML();
      }
    },
    toggleItalic() {
      if (this.tagName === "i") {
        eventBus.$emit("revertToolbar", this.nodeId);
        this.clearData()
      } else if (this.isValidSelectedText()) {
        this.editedString = `<i>${this.selectedText}</i>`;
        this.xml = `<title>${this.beforeSelectedText} ${this.editedString} ${this.afterSelectedText}</title>`;
        this.readXML();
      } else if (this.originalString) {
        console.log("original string", this.originalString);
        this.editedString = `<i>${JSON.stringify(this.originalString)}</i>`;
        this.xml = `<title>${this.editedString}</title>`;
        this.readXML();
      }
    },
    toggleUnderline() {
      if (this.tagName === "u") {
        eventBus.$emit("revertToolbar", this.nodeId);
        this.clearData()
      } else if (this.isValidSelectedText()) {
        this.editedString = `<u>${this.selectedText}</u>`;
        this.xml = `<title>${this.beforeSelectedText} ${this.editedString} ${this.afterSelectedText}</title>`;
        this.readXML();
      } else if (this.originalString) {
        this.editedString = `<u>${JSON.stringify(this.originalString)}</u>`;
        this.xml = `<title>${this.editedString}</title>`;
        this.readXML();
      }
    },
    toggleAddList() {
      if (this.isValidSelectedText()) {
        this.editedString = `<li>${this.selectedText}</li>`;
        this.xml = `<title>${this.beforeSelectedText} ${this.editedString} ${this.afterSelectedText}</title>`;
        this.readXML();
      } else if (this.originalString) {
        const body = {
          'reqType': "addNewNode",
          "editDetails": {
            "nodeId": this.nodeId,
            'xtag': 'li',
          }
        }
        eventBus.$emit("saveRecord");
        eventBus.$emit('body-updated', body);

      }
    },
    toggleOl() {
      if (this.tagName === "ol") {
        eventBus.$emit("revertToolbar", this.nodeId);
        this.nodeId = "";
      } else if (this.isValidSelectedText()) {
        this.editedString = `<ol><li>${this.selectedText}</li></ol>`;
        this.xml = `<title>${this.beforeSelectedText} ${this.editedString} ${this.afterSelectedText}</title>`;
        this.readXML();
      } else if (this.originalString) {
        console.log("original string", this.originalString);
        this.editedString = `<ol><li>${JSON.stringify(
          this.originalString
        )}</li></ol>`;
        this.xml = `<title>${this.editedString}</title>`;
        this.readXML();
      }
    },
    toggleUl() {
      if (this.tagName === "ul") {
        eventBus.$emit("revertToolbar", this.nodeId);
        this.nodeId = "";
      } else if (this.isValidSelectedText()) {
        this.editedString = `<ul><li>${this.selectedText}</li></ul>`;
        this.xml = `<title>${this.beforeSelectedText} ${this.editedString} ${this.afterSelectedText}</title>`;
        this.readXML();
      } else if (this.originalString) {
        console.log("original string", this.originalString);
        this.editedString = `<ul><li>${JSON.stringify(
          this.originalString
        )}</li></ul>`;
        this.xml = `<title>${this.editedString}</title>`;
        this.readXML();
      }
    },
    toggleUnorderedList() {
      document.execCommand("insertUnorderedList", false, null);
    },
    toggleOrderedList() {
      document.execCommand("insertOrderedList", false, null);
    },
    readXML() {
      let fileContentObjn = this.xml;
      let that = this;
      let domParser = new DOMParser();
      let xmlDom = domParser.parseFromString(
        fileContentObjn,
        "application/xml"
      );
      that.preProcess(xmlDom);
      that.xmlObject = null;
      that.xmlObject = that.xmlDomToJson(xmlDom.childNodes[0]);
      this.genarateNodeId();
      if (that.xmlObject.html && that.xmlObject.text) {
        return;
      }
    },
    preProcess(xml) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const node = xml.childNodes[i];
        if (node.nodeType !== 1) {
          xml.removeChild(node);
          i--;
        } else if (
          node.nodeName.toLowerCase() === "ul" ||
          node.nodeName.toLowerCase() === "ol"
        ) {
          this.preProcess(node);
        }
      }
    },
    xmlDomToJson(xml) {
      if (xml.nodeType !== 1) {
        return null;
      }
      let obj = {};
      obj.xtag = xml.nodeName;
      // Proess the text content if present
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
      // Assign the childNodes array to the object
      if (items.length > 0) {
        obj[obj.xtag] = items;
      }
      return obj;
    },
    handleAddToolbarTags(content) {
      if (content[0].b && !this.isValidSelectedText()) {
        content[0].b = JSON.parse(content[0].b[0]);
        this.tagData[this.tagData.xtag] = content;
      } else if (content[0].i && !this.isValidSelectedText()) {
        content[0].i = JSON.parse(content[0].i[0]);
        this.tagData[this.tagData.xtag] = content;
      } else if (content[0].li && !this.isValidSelectedText()) {
        content[0].li = JSON.parse(content[0].li[0]);
        this.tagData[this.tagData.xtag] = content;
      } else if (content[0].u && !this.isValidSelectedText()) {
        content[0].u = JSON.parse(content[0].u[0]);
        this.tagData[this.tagData.xtag] = content;
      } else if (content[0].ol && !this.isValidSelectedText()) {
        content[0].ol[0].li = JSON.parse(content[0].ol[0].li[0]);
        this.tagData[this.tagData.xtag] = content;
      } else if (content[0].ul && !this.isValidSelectedText()) {
        content[0].ul[0].li = JSON.parse(content[0].ul[0].li[0]);
        this.tagData[this.tagData.xtag] = content;
      } else {
        this.tagData[this.tagData.xtag].splice(this.self, 1, ...content);
      }
      this.addAncestorsRecursively(content[0], content[0].xtag)
    },
    addAncestorsRecursively(content, ancestorName) {
      if (typeof content === "string") return
      content[content.xtag].forEach((ele) => {
        if (ele.ancestors) {
          ele.ancestors[ancestorName] = true
          this.addAncestorsRecursively(ele, ancestorName)
        }
      })
    },
    genarateNodeId() {
      const body = {
        nodeDetails: this.xmlObject,
        ancestors: this.tagData.ancestors,
      };
      this.$store.getters.client
        .post(`/orguser/doceditor/generateNodeId`, body)
        .then((res) => {
          const newxtag = res.data.title[0].xtag || res.data.title[1].xtag;
          const newNodeId =
            res.data.title[0].nodeId || res.data.title[1].nodeId;
          eventBus.$emit("saveRecord");
          this.handleAddToolbarTags(res.data.title);
          // this.tagData[this.tagData.xtag].splice(this.self, 1, ...res.data.title)
          eventBus.$emit("", newxtag, newNodeId);
          eventBus.$emit("boldBackground", false);
          eventBus.$emit("italicBackground", false);
          eventBus.$emit("underlineBackground", false);
          eventBus.$emit("ulBackground", false);
          eventBus.$emit("olBackground", false);
          eventBus.$emit("addListBackground", false);
          switch (this.tagName) {
            case "b":
              eventBus.$emit("boldBackground", true);
              break;
            case "i":
              eventBus.$emit("italicBackground", true);
              break;
            case "u":
              eventBus.$emit("underlineBackground", true);
              break;
            case "ul":
              eventBus.$emit("ulBackground", true);
              break;
            case "ol":
              eventBus.$emit("olBackground", true);
              break;
            default:
              // Handle other cases or do nothing
              break;
          }
          (this.selectedText = ""),
            (this.beforeSelectedText = ""),
            (this.afterSelectedText = ""),
            (this.editedString = ""),
            (this.xml = null),
            (this.originalString = "");
          this.nodeId = "";
          this.tagData = "";
          this.self = "";
          this.tagName = "";
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    addChild() {
      const body = {
        reqType: "addNewNode",
        editDetails: {
          nodeId: this.tagData.nodeId,
          xtag: "xref",
        },
      };
      console.log("body", body);
      eventBus.$emit("add-link", body);
      this.selectedxtag = "";
      this.linkModalVisible = false;
    },
  },
};
</script>
<style scoped>
#page-topbar1 {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1px solid #dcdcdc;
}

/* Add your preferred background color to the custom class */
.custom-deny-button-class {
  background-color: #FF0000;
  /* Change to your desired color */
}

.toolbar {
  background-color: #f5f5f5;
  ;
  border-radius: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-background-class {
  background-color: #d3e3fd !important;
}

/* Additional styles if needed */

@media screen and (max-width: 768px) {

  /* Adjustments for smaller screens */
  .toolbar {
    margin: 10px;
    padding: 5px 10px;
  }
}
</style>
