<template>
  <div>
    <b-modal size="lg" id="modal-prevent-closing" ref="addtagmodal" title="ADD TAG" @hidden="resetModal" @ok="handleOk"
      hide-footer hide-close no-close-on-backdrop no-close-on-esc>
      <template #modal-header="{}">
        <h5><i class="ri-pencil-line"></i>Edit</h5>
        <b-button variant="primary" size="sm" class="float-right" @click="closeModel">
          Close
        </b-button>

      </template>
      <div class="container">
        <p class="badge badge-soft-primary mr-2" style="font-size: 14px">Selected Tag : {{ data.xtag }}</p>
        <b-tabs justified nav-class="nav-tabs-custom" content-class="p-3 text-muted">
          <b-tab title="Add Child Tag" active v-if="schema[name] && Object.keys(schema[name].validChild).length">
            <form ref="form" @submit.stop.prevent="handleSubmit" class="mt-1">
              <div v-if="schema[name] && Object.keys(schema[name].validChild).length">
                <div>
                  <div class="row">
                    <div class="col-md-9">
                      <b-form-group label-cols-sm="2" label="Xtag" label-for="Xtag-input"
                        invalid-feedback="Xtag is required">
                        <div>
                          <multiselect v-model="selectedxtag" :options="xtagOptions" placeholder="Select a Tag">
                          </multiselect>
                        </div>
                      </b-form-group>
                    </div>

                    <div class="col-md-2 text-center">
                      <button class="btn btn-primary w-lg  " @click="handleOk" :disabled="selectedxtag === null">Add
                        Tag</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </b-tab>
          <b-tab title="Add
            Attribute" v-if="schema[name] && Object.keys(schema[name].attributes).length">
            <form ref="form" @submit.stop.prevent="handleSubmit" class="mt-1">
              <div v-if="schema[name] && Object.keys(schema[name].attributes).length">
                <div class="row ">
                  <div class="col-md-12">
                    <b-form-group label-cols-sm="2" label="Attribute" label-for="Text-input"
                      invalid-feedback="Attribute is require">
                      <multiselect v-model="selectedAttribute" :options="attributeOptions"
                        placeholder="Select a Attribute">
                      </multiselect>
                    </b-form-group>
                  </div>
                  <div class="col-md-12 ">
                    <b-form-group label="Attribute value" label-for="Text-input" label-cols-sm="2"
                      invalid-feedback="Text is required">
                      <b-form-input id="name-input" v-model="selectedAttributeValue" required
                        placeholder="Enter Value"></b-form-input>
                    </b-form-group>
                  </div>
                  <div class=" d-flex justify-content-end col-md-12">
                    <button class="btn btn-primary w-lg   " @click="addAttribute()"
                      :disabled="!selectedAttribute || !selectedAttributeValue">Add
                      Attribute</button>
                  </div>
                </div>
              </div>
            </form>
          </b-tab>
        </b-tabs>
        <hr />

        <div>
          <div class="row">
            <div class="col">
              <!-- <h6 class="text-center"></h6> -->
              <p class="badge badge-soft-primary card-title mr-2" style="font-size: 14px">Attribute List</p>
              <div v-if="attributeList.length === 0" class="text-center">
                <p>No attributes added</p>
              </div>
              <table v-if="attributeList.length > 0" class=" table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th scope="col">Attribute Name</th>
                    <th scope="col">Attribute Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(attribute, index) in attributeList" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ attribute.name }}</td>
                    <td>{{ attribute.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-12 ">
            <div class="d-flex align-items-center justify-content-centent ">
              <p class="mr-4 pt-2 text-left">Delect this selected <code class="highlighter-rouge">{{ data.xtag }}</code>
                tag</p>
              <b-button variant="outline-danger" class="mr-2  w-lg " @click.stop="deleteTag(self)">
                <span class="d-flex  text-center  align-item-center justify-content-center">
                  <span>
                    <i class="fas fa-trash-alt mr-1"></i>
                  </span>
                  <span>
                    Delete Tag
                  </span>
                </span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div class="tagCard">
      <div v-if="typeof errorMessage === 'string'">
        <div class="text-center">
          <table class="table">
            <tbody>
              <tr>
                <td colspan="3" class="text-center font-size-14" style="margin-top: 10px;">
                  <div style="position: relative; display: inline-block;">
                    <img style="height: 250px; margin-bottom: 10px;" src="../../../../assets/placeholder.png" />
                    <div style="bottom: 0; left: 0; right: 0; color: #666 ;  font-size: 20px;">
                      {{ errorMessage }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <div class="d-flex flex-row">
          <div>
            <span @click.stop="collapse()" class="pr-2 " style="font-size: larger;"> {{ isOpen ? '-' : '+' }} </span>
          </div>
          <div v-if="schema[data.xtag]" @click.stop="openModel(name, data.nodeId)"
            class="tagButton d-flex align-items-center p-2 mb-2" style="max-height: 30px; user-select: none;">
            <div>{{ data.xtag }}</div>
          </div>
          <div class="d-flex ml-3 mr-4 align-items-center"
            style="max-height: 100px; max-width: 700px; overflow-y: auto; word-wrap: break-word;">
            <input class="inputtext" v-if="schema[data.xtag].textContent" v-model="data.text"
              @change="handleInputChange" />
          </div>
          <div v-if="schema[data.xtag]" @click.stop="openModel(name, data.nodeId)"
            class="tagButtonafter d-flex align-items-center p-2 mr-2" style="max-height: 30px; user-select: none; ">
            <div>{{ data.xtag }}</div>
          </div>
        </div>
        <div v-show="isOpen">
          <div class="pl-4">
            <recursive-tag v-for="(child, index) of childNodes" :key="index" :peers="[]" :data="child"
              @remove="removeThisTag" :self="index" :parentList="childNodes">
            </recursive-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
import schema from "../../../../assets/schema.js"
import { eventBus } from "../../../../main";
import { BTabs, BTab } from 'bootstrap-vue'
import Multiselect from "vue-multiselect";
export default {
  name: "RecursiveTag",
  components: {
    BTabs,
    BTab,
    Multiselect
  },
  props: {
    data: {
      type: Object,
      required: true,
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
      required: true,
    },
    errorMessage: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isOpen: true,
      selectedxtag: null,
      selectedText: null,
      xtagOptions: [],
      attributeOptions: [],
      selectedAttribute: null,
      selectedAttributeValue: null,
      nameState: null,
      schema: {},
      currentname: null,
      indexNum: null,
      nodeId: null,
      selectedTagNodeId: null,
      xmlObject: null,
      attributeList: [],
      isView: false,
      addTag: false,
      addAttr: false,
    };
  },
  mounted() {
    // this.getSchema(),
    this.$on('error-message', errData => {
      console.log("errData", errData);
    });
    this.getData()
    this.getSchemaFromLocalStorage()
  },
  computed: {
    name() {
      if (this.data && this.data.xtag) {
        return this.data.xtag;
      } else {
        return "";
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
    showAddTag() {
      if (this.addTag) {
        this.addTag = false;
      } else {
        this.addTag = true;
        this.addAttr = false
      }
    },
    showAddAttribute() {
      if (this.addAttr) {
        this.addAttr = false;
      } else {
        this.addAttr = true;
        this.addTag = false
      }
    },
    viewFun() {
      if (this.isView) {
        this.isView = false;
        this.genarateAttributeList()
      } else {
        this.isView = true;
        this.genarateAttributeList()
      }
    },
    deleteTag(index) {
      this.parentList.splice(index, 1);
      this.$refs.addtagmodal.hide();
    },
    getOption() {
      this.$refs.viewDetailsModel.show();
    },
    genarateAttributeList() {
      const attributelist = []
      for (const key in this.data) {
        console.log("key", key);
        if (key !== "nodeId" && key !== 'childFrequency' && key !== 'xtagNew' && key !== 'xtag' && key !== 'text' && key !== this.data.xtag) {
          const newAttr = {
            name: key,
            value: this.data[key]
          }
          attributelist.push(newAttr)
        }
      }
      this.attributeList = attributelist
    },
    handleInputChange() {
      console.log('Input value changed:', this.data.text);
      eventBus.$emit('valuechange', this.data)
    },
    getSchemaFromLocalStorage() {
      this.schema = schema
    },
    collapse() {
      this.isOpen = !this.isOpen;
      let that = this;
      eventBus.$emit("clicktag", that.data);
    },
    toggleModal() {
      this.modalVisible = !this.modalVisible
    },
    handleClickRemove() {
      eventBus.$emit("remove", this.self);
    },
    removeThisTag(indexNum) {
      eventBus.$emit("edit-happen");
      this.childNodes.splice(indexNum, 1);
      eventBus.$emit("clear-attributes");
    },
    getData() {
      eventBus.$on('xmlData', (xmlData) => {
        this.xmlObject = xmlData;
      });
    },
    addChild(nodeId) {
      this.isView = false
      const body = {
        'reqType': "addNewNode",
        "editDetails": {
          "nodeId": nodeId,
          'xtag': this.selectedxtag,
        }
      }
      eventBus.$emit('body-updated', body);
    },
    openModel(name, nodeId) {
      this.xtagOptions = Object.keys(this.schema[name].validChild)
      this.attributeOptions = Object.keys(this.schema[name].attributes)
      this.selectedxtag = null,
        this.selectedText = null,
        this.selectedAttribute = null,
        this.selectedAttributeValue = null,
        this.genarateAttributeList()
      this.$refs.addtagmodal.show();
      this.isView = false,
        this.currentname = name;
      this.selectedTagNodeId = nodeId
    },
    handleOk(event) {

      event.preventDefault()
      console.log("okhandle", this.currentname);
      this.isView = false,
        // Trigger submit handler
        this.handleSubmit(this.selectedTagNodeId)
    },
    handleSubmit(nodeId) {
      // Exit when the form isn't valid
      // if (this.selectedxtag == null || this.selectedText == null || this.selectedAttribute == null || this.selectedAttributeValue == null) {
      //   return
      // }
      console.log("handleSubmit", nodeId);
      this.addChild(nodeId)
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    closeModel() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    resetModal() {
      this.selectedxtag = null
      this.selectedText = null
      this.selectedAttribute = null,
        this.selectedAttributeValue = null
    },
  },
};
</script>
   
<style scoped>
.tagButton {
  border: 1px solid #2b313f;
  border-right: none;
  color: black;
  padding: 10px 20px;
  border-radius: 4px;
  position: relative;
  background: linear-gradient(to top, #eef1f1, #f0ffff);
}

.tagButton::after {
  content: "";
  height: 21px;
  width: 21px;
  border-top: 1px solid #2b313f;
  border-right: 1px solid #2b313f;
  position: absolute;
  top: 3.5px;
  right: -9px;
  border-radius: 2px 2px 0px 500px;
  transform: rotate(45deg);
  background: linear-gradient(to top, #eef1f1, #f0ffff);
}

.tagButton:hover::after,
.tagButton:hover {
  background: #2b313f !important;
  color: #fff !important;
  text-decoration: underline;
}

.tagButtonafter {
  border: 1px solid #2b313f;
  border-left: none;
  color: black;
  padding: 10px 20px;
  border-radius: 4px;
  position: relative;
  background: linear-gradient(to top, #eef1f1, #f0ffff);
}

.tagButtonafter::after {
  content: "";
  height: 21px;
  width: 21px;
  border-top: 1px solid #2b313f;
  border-left: 1px solid #2b313f;
  position: absolute;
  top: 3.5px;
  left: -9px;
  border-radius: 0px 0px 200px 2px;
  transform: rotate(-45deg);
  background: linear-gradient(to top, #eef1f1, #f0ffff);
}

.btn-custom {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #2b313f;
  background: linear-gradient(to top, #eef1f1, #f0ffff);
  color: #000000;
  margin: 2px;

}

.btn-custom:hover {
  background-color: #eee;
  color: #333;
}

.tagButtonafter:hover::after,
.tagButtonafter:hover {
  background: #2b313f !important;
  color: #fff !important;
  text-decoration: underline;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.inputtext {
  border: none;
  outline: none;
  /* text-decoration: underline dashed; */
}
</style>
     