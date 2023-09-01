<template>
  <div @mouseup="() =>
    handleMouseUp(
      $event,
      name || parentData.xtag,
      data.nodeId || parentNodeId
    )
    " @mousedown="handleMouseDown" @click.stop="
    selectTag(name || parentData.xtag, data.nodeId || parentNodeId)
    ">
    <div>
      <div v-if="typeof errorMessage === 'string'" style="background-color: ;">
        <div class="text-center">
          <div class="d-flex justify-content-center">
            <div class="position-relative">
              <img style="height: 250px; margin-bottom: 10px;" src="../../../../assets/placeholder.png"
                alt="Placeholder Image" />
              <div style="bottom: 0; left: 0; right: 0; color: #666; font-size: 20px;">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <textarea rows="1" v-else-if="typeof data === `string`" ref="inputtext_0" class="inputtext  " :value="data"
        @input="updateData" :class="[
          { bold: parentData.xtag === 'b' || parentData.ancestors.b },
          { italic: parentData.xtag === 'i' || parentData.ancestors.i },
          { underline: parentData.xtag === 'u' || parentData.ancestors.u },
        ]" @mouseup="() => handleMouseUp($event, name || parentData.xtag, data.nodeId || parentNodeId)"
        @mousedown="handleMouseDown" @click.stop="
          selectTag(name || parentData.xtag, data.nodeId || parentNodeId)
          " />
      <div v-else>
        <div class="d-flex flex-row align-items-center">
          <div>
            <span @click.stop="collapse()" class="pr-2"
              style="color: #1C274C; width: 11px; font-size: 11px; cursor: pointer; user-select: none;">
              {{ isOpen ? "▶" : "▼" }}
            </span>
          </div>
          <div v-if="schema[data.xtag]" :class="[
            'tagButton',
            'd-flex',
            'align-items-center',
            'p-2',
            { highlight: data.nodeId === selectedTag },
          ]" :data-nodeid="data.nodeId" style="max-height: 10px; user-select: none; cursor: pointer;">
            <div>{{ data.xtag }}</div>
          </div>
          <div class="d-flex ml-3 mr-4 align-items-center"
            style="max-height: 100px; max-width: auto; white-space: nowrap; user-select: none;">
            <!-- <textarea rows="1" ref="inputtext" class="inputtext prevent-select" @input="autoResize"
              v-if="data[data.xtag] && !data[data.xtag][0] && schema[data.xtag].textContent" v-model="data.text" :class="[
                { bold: parentData.xtag === 'b' || parentData.ancestors.b },
                { italic: parentData.xtag === 'i' || parentData.ancestors.i },
                { underline: parentData.xtag === 'u' || parentData.ancestors.u },
              ]" /> -->
          </div>
        </div>
        <div v-show="isOpen">
          <div class="pl-4">
            <recursive-tag v-for="(child, index) of childNodes" :key="index" :peers="[]" :data="child" ref="recursiveTag"
              :self="index" :parentList="childNodes" :selectedTag="selectedTag" :parentNodeId="data.nodeId"
              :parentData="data">
            </recursive-tag>
          </div>
          <div class="pl-4 d-flex">
            <div v-if="schema[data.xtag]" :class="[
              'tagButtonafter',
              'd-flex',
              'align-items-center',
              'p-2',
              'mb-1',
              { highlight: data.nodeId === selectedTag },
            ]" :data-nodeid="data.nodeId"
              style="max-height: 10px; user-select: none; cursor: pointer; max-width: fit-content; display: inline-flex;">
              <div style="display: inline-flex; min-width: max-content;">
                {{ data.xtag }}
              </div>
            </div>
            <textarea @click.stop="selectTag(parentData.xtag, parentNodeId)" ref="inputtext_1" v-if="typeof parentData === `object` &&
              typeof parentData[parentData.xtag][parentList.length - 1] !==
              `string` &&
              schema[parentData.xtag].textContent
              " @input="append_text" :class="[
    { bold: parentData.xtag === 'b' || parentData.ancestors.b },
    { italic: parentData.xtag === 'i' || parentData.ancestors.i },
    {
      underline: parentData.xtag === 'u' || parentData.ancestors.u,
    },
  ]" class="inputtext" rows="1" @mouseup="() =>
  handleMouseUp(
    $event,
    name || parentData.xtag,
    data.nodeId || parentNodeId
  )
  " @mousedown="handleMouseDown" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import schema from "../../../../assets/schema.js";
import { eventBus } from "../../../../main";

export default {
  name: "RecursiveTag",
  components: {},
  props: {
    data: {
      type: [Object, String],
      // required: true,
    },
    self: {
      type: Number,
      required: true,
    },
    peers: {
      type: Array,
      required: true,
    },
    parentList: {
      type: Array,
    },
    errorMessage: {
      type: [Object, String, undefined],
    },
    selectedTag: {
      type: String,
      required: true,
    },
    parentNodeId: {
      type: String || undefined,
    },
    parentData: {
      type: [Object || String || undefined],
    },
  },
  data() {
    return {
      maketextbold: false,
      maketextitalic: false,
      isOpen: true,
      selectedxtag: null,
      xtagOptions: [],
      attributeOptions: [],
      selectedAttribute: null,
      selectedAttributeValue: null,
      nameState: null,
      nameValue: "",
      schema: {},
      currentname: null,
      indexNum: null,
      nodeId: null,
      xmlObject: null,
      attributeList: [],
      tagData: [],
      TextList: [],
      isView: false,
      addTag: false,
      addAttr: false,
      selectedText: "",
      isTextSelected: false,
      event: "",
    };
  },
  watch: {
    data: {
      handler() {
        this.autoResize();
      },
      deep: true, // Watch for changes in nested properties of data
    },
    errorMessage: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (typeof newValue === "string") {
            eventBus.$emit("validFileSelected", false);
          } else {
            eventBus.$emit("validFileSelected", true);
          }
        }
      },
      immediate: true, // Trigger the watcher immediately when the component is created
    },
  },
  mounted() {
    eventBus.$on("revertToolbar", (nodeId) => {
      if (this.data.nodeId === nodeId) {
        eventBus.$emit("saveRecord");
        this.parentData[this.parentData.xtag].splice(
          this.self,
          1,
          ...this.data[this.data.xtag]
        );
        eventBus.$emit("joinTextInputs", "");
        eventBus.$emit("boldBackground", false);
        eventBus.$emit("italicBackground", false);
        eventBus.$emit("underlineBackground", false);
        eventBus.$emit("ulBackground", false);
        eventBus.$emit("olBackground", false);
      }
    });
    eventBus.$on("nodeIdUpdate", (newxtag, newNodeId) => {
      this.handleUpdate(newxtag, newNodeId);
    });
    eventBus.$on("joinTextInputs", () => {
      this.joinTextInputs();
    });
    this.autoResize = this.autoResize.bind(this);
    this.autoResize();
    eventBus.$on("update:data", (value, indx, parentNodeId) => {
      if (parentNodeId === this.data?.nodeId) {
        this.childNodes[indx] = value;
      }
    });
    eventBus.$on("generateTagList", this.generateNewTagList);
    eventBus.$on("joinAllText", (parentNodeId) => {
      if (parentNodeId === this.data.nodeId) {
        this.joinTextInputs();
      }
    });
    eventBus.$on("autoResize", () => {
      this.autoResize();
    });
    eventBus.$on("deleteTag", (nodeId) => {
      if (nodeId === this.data?.nodeId) {
        eventBus.$emit("saveRecord");
        this.parentData.childFrequency[this.data.xtag]--;
        this.parentList.splice(this.self, 1);
        eventBus.$emit("validTagSelected", null);
        this.autoResize();
      }
    });
    this.$on("error-message", (errData) => {
      console.log("errData", errData);
    });
    eventBus.$on("selectedAttributevalue", (attrData) => {
      attrData.forEach((ele) => {
        (this.selectedAttribute = ele.selectedAttribute),
          (this.selectedAttributeValue = ele.selectedAttributeValue);
      });
      this.addAttribute();
    });
    this.getData();
    this.getSchema();
  },
  beforeDestroy() {
    eventBus.$off("deleteTagEvent", this.deleteTag);
    eventBus.$off("updateNodeId");
  },
  computed: {
    name() {
      if (this.data && this.data.xtag) {
        return this.data.xtag;
      } else {
        return this.nameValue;
      }
    },
    childNodes() {
      //this card's children's data, a referrence of props
      for (let x in this.data) {
        if (this.data[x] instanceof Array) {
          return this.data[x];
        }
      }
      return [];
    },
    hasChild() {
      for (let x in this.data) {
        if (this.data[x] instanceof Array) {
          if (this.data[x].length > 0) {
            return true;
          }
        }
      }
      return false;
    },
  },
  methods: {
    joinTextInputs() {
      if (this.data[this.data.xtag].length) {
        for (let i = 0; i < this.data[this.data.xtag].length; i++) {
          if (
            typeof this.data[this.data.xtag][i] === "string" &&
            typeof this.data[this.data.xtag][i + 1] === "string"
          ) {
            this.data[this.data.xtag].splice(
              i,
              2,
              this.data[this.data.xtag][i] +
              "" +
              this.data[this.data.xtag][i + 1]
            );
            console.log(this.data[this.data.xtag]);
            i--;
          }
        }
      }
    },
    handleUpdate(newxtag, newNodeId) {
      newNodeId;
      this.generateTextList(newxtag);
    },

    handleMouseUp($event, xtag, nodeId) {
      // Get the reference to the textarea element
      const textarea = this.$refs.inputtext_0;

      // Check if there is any value within the textarea
      if (textarea.value.trim()) {
        // Emit an event with false if text is selected
        eventBus.$emit("clearSelectedText", false);
      } else {
        // Emit an event with true if no text is selected
        eventBus.$emit("clearSelectedText", true);
      }

      // Extract various information about the selected text and other data
      const originalString = textarea.value;
      const mouseUpnodeId = nodeId;
      const mouseUpxtag = xtag;

      const mouseupancestors = this.data.ancestors;
      const tagData =
        typeof this.data === "object" ? this.data : this.parentData;
      const self = this.data[this.data.xtag] ? 0 : this.self;
      const selectedText = textarea.value.substring(
        textarea.selectionStart,
        textarea.selectionEnd
      );
      const beforeText = textarea.value.substring(0, textarea.selectionStart);
      const afterText = textarea.value.substring(textarea.selectionEnd);

      // Set the isTextSelected flag to true
      this.isTextSelected = true;

      // Emit the "selected-text" event with all the extracted data
      eventBus.$emit(
        "selected-text",
        selectedText || null,
        beforeText,
        afterText,
        mouseUpnodeId,
        mouseUpxtag,
        mouseupancestors,
        originalString,
        tagData,
        self
      );
    },

    handleMouseDown(event) {
      event;
      if (this.isTextSelected) {
        this.clearSelection();
      }
    },
    clearSelection() {
      this.selectedText = "";
      this.isTextSelected = false;
    },

    append_text(e) {
      this.autoResize();
      const parentXtag = this.parentData.xtag;
      if (
        typeof this.parentData === "object" &&
        typeof this.parentData[parentXtag][this.parentList.length - 1] !==
        "string"
      ) {
        this.parentData[parentXtag][this.parentList.length] = e.target.value;
      } else {
        this.parentData[parentXtag][this.parentList.length - 1] =
          e.target.value;
      }
    },
    autoResize() {
      this.$nextTick(() => {
        if (this.$refs.inputtext) {
          this.$refs.inputtext.style.height = "auto";
          this.$refs.inputtext.style.height =
            this.$refs.inputtext.scrollHeight + "px";
        }
        if (this.$refs.inputtext_0) {
          this.$refs.inputtext_0.style.height = "auto";
          this.$refs.inputtext_0.style.height =
            this.$refs.inputtext_0.scrollHeight + "px";
        }
        if (this.$refs.inputtext_1) {
          this.$refs.inputtext_1.style.height = "auto";
          this.$refs.inputtext_1.style.height =
            this.$refs.inputtext_1.scrollHeight + "px";
        }
      });
    },
    updateData(event) {
      this.autoResize();
      console.log("Edited Text:", event.target.value);
      eventBus.$emit(
        "update:data",
        event.target.value,
        this.self,
        this.parentNodeId
      );
    },
    selectTag(name, nodeId) {
      this.generateTextList(name);
      eventBus.$emit("selectedTagData", nodeId), (this.name = name);
      this.nodeId = nodeId;
      this.openModel(name, nodeId), this.tagSelected();
    },
    deleteTag(index) {
      this.parentList.splice(index, 1);
    },
    getOption() {
      this.$refs.viewDetailsModel.show();
    },
    genarateAttributeList() {
      const attributelist = [];
      for (const key in this.data) {
        if (
          key !== "nodeId" &&
          key !== "childFrequency" &&
          key !== "xtagNew" &&
          key !== "xtag" &&
          key !== "text" &&
          key !== this.data.xtag
        ) {
          const newAttr = {
            name: key,
            value: this.data[key],
            tagName: this.data.xtag,
            nodeId: this.data.nodeId,
            data: this.data,
          };
          attributelist.push(newAttr);
        }
      }
      this.attributeList = attributelist;
      // this.generateTextList();
      eventBus.$emit("attributelist-list-generated", attributelist);
    },
    tagSelected() {
      eventBus.$emit("validTagSelected", true);
    },
    generateTextList(tagName) {
      const newTagData = {
        e: tagName,
        ancestors: this.data.ancestors,
        data: typeof this.data === "object" ? this.data : this.parentData,
        text: this.data[this.data.xtag]
          ? this.data[this.data.xtag]
          : this.parentData[this.parentData.xtag],
        nodeId: this.data.nodeId || this.parentNodeId,
        self: this.data[this.data.xtag] ? 0 : this.self,
        parentNodeId: this.parentNodeId,
      };
      this.tagData.push(newTagData);
      eventBus.$emit("tagData-genarated", this.tagData);
      eventBus.$emit(
        "setCollectedTagData",
        typeof this.data === "object" ? this.data : this.parentData
      );
      const textarea = this.$refs.inputtext_0;
      if (textarea) {
        eventBus.$emit("clearSelectedText", false);
      } else {
        eventBus.$emit("clearSelectedText", true);
      }
    },
    handleInputChange() {
      console.log("Input value changed", this.data.text);
      eventBus.$emit("valuechange", this.data);
    },
    getSchema() {
      this.schema = schema;
    },
    collapse() {
      this.isOpen = !this.isOpen;
      // console.log(e)
      let that = this;
      eventBus.$emit("clicktag", that.data);
    },
    toggleModal() {
      this.modalVisible = !this.modalVisible;
    },
    handleClickRemove() {
      eventBus.$emit("remove", this.self);
    },
    getData() {
      eventBus.$on("xmlData", (xmlData) => {
        this.xmlObject = xmlData;
      });
    },
    addAttribute() {
      (this.data[this.selectedAttribute] = this.selectedAttributeValue),
        eventBus.$emit("add-attribute", this.data);
      this.genarateAttributeList();
    },
    openModel(name, nodeId) {
      this.xtagOptions = Object.keys(this.schema[name].validChild);
      this.attributeOptions = Object.keys(this.schema[name].attributes);
      this.selectedxtag = null;
      this.selectedText = null;
      this.selectedAttribute = null;
      this.selectedAttributeValue = null;
      this.genarateAttributeList();
      this.generateTextList(name);
      this.isView = false;
      this.currentname = name;
      this.selectedTagNodeId = nodeId;
      this.xtagOptions = Object.keys(this.schema[name].validChild).map(
        (ele) => {
          const elementFrequency = this.data.childFrequency
            ? this.data.childFrequency[ele]
            : this.parentData.childFrequency[ele];
          return {
            text: ele,
            value: ele,
            disabled:
              schema[name].validChild[ele].maxOcc <= elementFrequency
                ? true
                : false,
          };
        }
      );
      eventBus.$emit(
        "tag-frequency",
        this.xtagOptions,
        this.attributeOptions,
        this.data.childFrequency
      );
    },

    handleOk(event) {
      event.preventDefault();
      (this.isView = false), this.handleSubmit(this.selectedTagNodeId);
    },
    handleSubmit(nodeId) {
      this.addChild(nodeId);
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    closeModel() {
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    resetModal() {
      this.selectedxtag = null;
      this.selectedText = null;
      (this.selectedAttribute = null), (this.selectedAttributeValue = null);
    },
  },
};
</script>
<style scoped>
.tagButton {
  border: 1px solid #929aaa;
  border-right: none;
  color: black;
  border-radius: 4px;
  position: relative;
  background: linear-gradient(to top, #eef1f1, #f0ffff);
  font-size: 14px;
}

.tagButton::after {
  content: "";
  height: 11.5px;
  width: 11.5px;
  border-top: 1px solid #929aaa;
  border-right: 1px solid #929aaa;
  position: absolute;
  top: 2px;
  right: -4.5px;
  border-radius: 2px 2px 0px 500px;
  transform: rotate(45deg);
  background: linear-gradient(to top, #eef1f1, #f0ffff);
}

.tagButtonafter {
  border: 1px solid #929aaa;
  border-left: none;
  color: black;
  padding: 10px 20px;
  border-radius: 4px;
  position: relative;
  background: linear-gradient(to top, #eef1f1, #f0ffff);
  font-size: 14px;
}

.tagButtonafter::after {
  content: "";
  height: 11.5px;
  width: 11.5px;
  border-top: 1px solid #929aaa;
  border-left: 1px solid #929aaa;
  position: absolute;
  top: 2px;
  left: -5px;
  border-radius: 0px 0px 500px 2px;
  transform: rotate(-45deg);
  background: linear-gradient(to top, #eef1f1, #f0ffff);
}

.btn-custom {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #afafaf;
  background: linear-gradient(to top, #eef1f1, #f0ffff);
  color: #000000;
  margin: 2px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.inputtext {
  border: none;
  outline: none;
  width: 100%;
  resize: none;
  /* Disable resizing via user interaction */
  overflow: hidden;
}

.tagButtonafter:hover::after,
.button-container {
  display: flex;
  justify-content: space-between;
}

.inputtext {
  border: none;
  outline: none;
  height: min-content;
}

.tagButton.highlight {
  background: #d3e3fd;
  color: black;
  font-weight: bold;
}

.tagButtonafter.highlight {
  color: black;
  background: #d3e3fd;
  font-weight: bold;
}

.highlight::after {
  color: black;
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  background: #d3e3fd;
  font-weight: bolder;
}

.highlight::before {
  color: black;
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  background: #d3e3fd;
  font-weight: bolder;
}

.bold {
  font-weight: bold !important;
  text-shadow: 0px 0px 1px rgb(95, 95, 95);
}

.italic {
  font-style: italic !important;
}

.underline {
  text-decoration: underline;
}

.prevent-select {
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
}

::-moz-selection {
  /* Code for Firefox */
  /* color: rgb(60, 64, 67);  */
  /* background: yellow; */
  overflow-x: auto;
  background-color: rgb(59 130 246 / 0.5);
  height: 654px;
  cursor: auto;
}

::selection {
  overflow-x: auto;
  background-color: rgb(59 130 246 / 0.5);
  height: 654px;
  cursor: auto;
  font-size: 16px;
  color: #000000;
  font-weight: normal;
  text-decoration: none;
  font-family: "Arial";
  font-style: normal;
  text-decoration-skip-ink: none;
}
</style>
