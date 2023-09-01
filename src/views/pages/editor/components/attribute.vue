<template>
    <div>
        <div v-if="!validFileSelected && typeof errorMessage === 'string'"
            class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                    <div style=" color: #666; font-size: 16px;">
                        {{ errorMessage || "Please select a valid XML file." }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!tagSelected">
            <div class="text-center d-flex flex-column align-items-center">
                <div class="d-flex justify-content-center align-items-center m-0 p-0">
                    <div class="text-center">
                        <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                        <div style="color: #666; font-size: 16px;">
                            Please select a valid tag
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="row" no-body>
                <div class="col-md-12">
                    <div>
                        <div v-if="attributeList.length === 0 && !addAttributeVisibleInput"
                            class="text-center d-flex flex-column align-items-center">
                            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                                <div class="text-center">
                                    <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                                    <div style="color: #666; font-size: 16px;">
                                        No attribute added
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12" v-if="attributeList.length > 0">
                            <div class="card">
                                <div class="card-body">
                                    <h4 class="card-title text-uppercase">Selected tag : {{ this.tagName }}</h4>
                                    <p class="card-title-desc">
                                        This table displays attribute information of <code>{{ this.tagName }}</code> tag.
                                    </p>
                                    <div class="table-responsive table-striped" simplebar style=" height: 25vh;">
                                        <table class="table table-sm m-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Attribute</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody style="overflow: scroll;">
                                                <tr v-for="(attribute, index) in attributeList" :key="index">
                                                    <th scope="row">{{ index + 1 }}</th>
                                                    <td>{{ attribute.name }}</td>
                                                    <td>{{ attribute.value }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!addAttributeVisibleInput" class="col-md-12 text-center ">
                <b-button @click="showAddAttribute" variant="light" size="sm" class="w-lg">Add Attribute</b-button>
            </div>
            <div v-if="addAttributeVisibleInput" class="mt-1">
                <div class="col-md-12">
                    <form ref="form" @submit.stop.prevent="handleSubmit" class="mt-2">
                        <div>
                            <div class="row mx-2 " style="background-color: #f1f5f7">
                                <h6 class="heading-center">
                                    Add Attribute
                                </h6>
                                <div class="col-md-12">
                                    <b-form-group label-for="Text-input" invalid-feedback="Attribute is require">
                                        <multiselect v-model="selectedAttribute" :options="attributeOptions"
                                            placeholder="Select Attribute">
                                        </multiselect>
                                    </b-form-group>
                                </div>
                                <div class="col-md-12">
                                    <b-form-group label-for="Text-input" invalid-feedback="Text is required">
                                        <b-form-input id="name-input" v-model="selectedAttributeValue" required
                                            placeholder="Enter Value"></b-form-input>
                                    </b-form-group>
                                </div>
                                <div class="d-flex justify-content-center col-md-12 mb-4">
                                    <button class="btn btn-primary btn-sm w-sm mr-2" @click="setvalue()"
                                        :disabled="!selectedAttribute || !selectedAttributeValue">
                                        Add
                                    </button>
                                    <button class="btn btn-primary btn-sm  w-sm" @click="showAddAttribute()">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.overflow-wrap {
    word-wrap: break-word;
    word-break: break-all;
}
</style>
<script>
import { eventBus } from '../../../../main';
import schema from "../../../../assets/schema.js"
import Multiselect from "vue-multiselect";
export default {
    components: {
        Multiselect,
    },
    props: {
        data: {
            type: [Object, String],
            required: true,
        },
        errorMessage: {
            type: [Object, String, undefined],
        },
    },
    data() {
        return {
            tagSelected: false,
            validFileSelected: true,
            attributeList: [],
            schema: {},
            addAttributeVisibleInput: false,
            showAddAttributebtn: false,
            selectedAttribute: null,
            selectedAttributeValue: null,
            attributeOptions: [],
            tagName: '',
            nodeId: '',
            xtagOptions: [],
            nameState: null,
            currentname: null,
            indexNum: null,
            selectedTagNodeId: null,
            xmlObject: null,
            TextList: [],
            isView: false,
            addTag: false,
            addAttr: false,
            attrData: [],
            selectedTagData: null
        };
    },
    created() {
        eventBus.$on("setCollectedTagData", (selectedTagData) => {
            this.selectedTagData = selectedTagData
            this.tagName = selectedTagData.xtag
            this.attributeOptions = Object.keys(this.schema[selectedTagData.xtag].attributes)
            this.genarateAttributeList(selectedTagData)
        })
        eventBus.$on('tag-frequency', (xtagOptions, attributeOptions) => {
            this.xtagOptions = xtagOptions
            this.attributeOptions = attributeOptions
            this.attributeOptions.sort((a, b) => {
                const textA = a.toUpperCase();
                const textB = b.toUpperCase();
                if (textA < textB) {
                    return -1;
                }
                if (textA > textB) {
                    return 1;
                }
                return 0;
            });

        });
        eventBus.$on('validTagSelected', (flag) => {
            this.tagSelected = flag;
        });
        eventBus.$on('validFileSelected', (flag) => {
            this.validFileSelected = flag;
            this.tagSelected = false
        });
    },
    mounted() {
        this.getSchema()
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getSchema() {
            this.schema = schema
        },
        showAddAttribute() {
            this.addAttributeVisibleInput = !this.addAttributeVisibleInput
            this.showAddAttributebtn = !this.showAddAttributebtn
        },
        setvalue() {
            const existingAttribute = this.attributeList.find(attr => attr.name === this.selectedAttribute);
            if (existingAttribute) {
                this.messageToast(
                    "Success",
                    "info",
                    "Attribute value updated successfully."
                );
                this.selectedTagData[this.selectedAttribute] = this.selectedAttributeValue
                this.genarateAttributeList(this.selectedTagData)
            } else {
                this.selectedTagData[this.selectedAttribute] = this.selectedAttributeValue
                this.genarateAttributeList(this.selectedTagData)
            }

            // Clear the input values
            this.selectedAttribute = null;
            this.selectedAttributeValue = null;
        },

        genarateAttributeList(selectedTagData) {
            const attributelist = [];
            for (const key in selectedTagData) {
                if (
                    key !== "nodeId" &&
                    key !== "childFrequency" &&
                    key !== "xtagNew" &&
                    key !== "xtag" &&
                    key !== "text" &&
                    key !== selectedTagData.xtag &&
                    key !== 'ancestors'
                ) {
                    const newAttr = {
                        name: key,
                        value: selectedTagData[key],
                    };
                    attributelist.push(newAttr);
                }
            }
            this.attributeList = attributelist;
            this.selectedAttribute = ''
            this.selectedAttributeValue = ""
        }
    }
};
</script>
<style>
.heading-center {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    /* margin-top: 15px; */
    margin-bottom: 15px;
}
</style>
  