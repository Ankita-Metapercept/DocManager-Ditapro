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
        <div v-else-if="!tagSelected" class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                    <div style=" color: #666; font-size: 16px;">
                        Please select a valid tag
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="xtagOptions.length === 0" class="text-center d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                    <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                    <div style=" color: #666; font-size: 16px;">
                        The selected tag does not have any child tags
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-12">
                    <div v-if="xtagOptions.length === 0" class="text-center d-flex flex-column align-items-center">
                        <div class="d-flex justify-content-center align-items-center m-0 p-0">
                            <div class="text-center">
                                <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                                <div style=" color: #666; font-size: 16px;">
                                    No tag selected
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="col-md-12 mt-2">
                        <div>
                            <div class="row  mx-2 " style="background-color: #f1f5f7">
                                <h5 class="heading-center ">
                                    Add Tag
                                </h5>
                                <div class="col-md-12">
                                    <b-form-group label-for="Tag-select" :state="!selectedxtag" >
                                        <b-form-select id="Tag-select" v-model="selectedxtag">
                                            <option value=null disabled>Please select a tag</option>
                                            <option v-for="option in xtagOptions" :key="option.value" :value="option.value"
                                                :disabled="option.disabled">
                                                {{ option.text }}
                                            </option>
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div class="d-flex justify-content-center col-md-12 mb-4">
                                    <button class="btn btn-primary btn-sm w-sm mr-2" @click="addChild()"
                                        :disabled="!selectedxtag">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import schema from "../../../../assets/schema.js";
import { eventBus } from '../../../../main';
// import Multiselect from "vue-multiselect";
export default {
    components: {
        // Multiselect,
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
            tagName: '',
            nodeId: '',
            selectedxtag: null,
            selectedText: null,
            xtagOptions: [
            ],
            schema: {},
        };
    },
    created() {
        eventBus.$on('tagData-genarated', (data) => {
            this.attributeList = data;
            this.xtagOptions = [];
            data.forEach((ele) => {
                this.tagName = ele.e;
                this.nodeId = ele.nodeId;
            });
        });
        eventBus.$on('tag-frequency', (xtagOptions, attributeList, childFrequency) => {
            this.selectedxtag = null,
                this.xtagOptions = xtagOptions,
                this.xtagOptions.sort((a, b) => {
                    const textA = a.text.toUpperCase();
                    const textB = b.text.toUpperCase();

                    if (textA < textB) {
                        return -1;
                    }
                    if (textA > textB) {
                        return 1;
                    }
                    return 0;
                });
            this.childFrequency = childFrequency
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
        getSchema() {
            this.schema = schema;
        },
        addChild() {
            const body = {
                'reqType': "addNewNode",
                "editDetails": {
                    "nodeId": this.nodeId,
                    'xtag': this.selectedxtag,
                }
            }
            eventBus.$emit('body-updated', body);
            this.selectedxtag = null
        },
    }
};
</script>
<style>
.heading-center {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
}

option:disabled {
    background: #e7e7e8 !important;
    color: #b6b6be !important;
}

option:selected {
    background: red !important;
    color: #b6b6be !important;
    background-color: red;
}

.disable-cust-cls {
    background: #e7e7e8 !important;
    color: #838588 !important;
}
</style>
  