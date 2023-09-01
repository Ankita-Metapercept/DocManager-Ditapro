<template>
    <!-- <div>
        <p class="inline" v-show="!isEdit">
            {{ name }} : {{ value }} 
        </p>
        <i class="fa fa-close" title="remove" @click="remove"></i>
        <i class="fa fa-edit" title="edit" @click="edit"></i>
        <div v-show="isEdit">
            <input autofocus="autofocus"
                :value="value" ref="input" @keyup.enter="change">
            <i class="fa fa-check" @click="change"></i>
        </div>
    </div> -->

    <div>
        <div class="d-flex m-3 justify-content-between align-items-center  border rounded p-3 tageditor">
            <div class="d-flex flex-column ">
                <h5 class="mb-0">{{ name }}:</h5>
                <p class="mb-0">{{ value }}</p>
            </div>
            <div>
                <button class="btn btn-success btn-sm" v-on:click="editFun">
                    <i class="ri-edit-box-line"></i>
                </button>
                <!-- <button v-on:click.stop="openModel(value)" class="btn btn btn-success  ">
                    <i class="fa "></i> Add Attribute
                </button> -->
            </div>
        </div>
        <div class="my-5 mx-3 editor" v-if="isEdit">
            <div class="card-header bg-card">
                <h5 class="card-title text-white mb-0">
                    <i class="ri-folder-4-fill"></i> Editor
                </h5>
            </div>
            <div class="container mt-3">
                <div class="card">
                    <div class="card-body">
                        <Label >{{name }}</Label>
                        <input v-model="value" class="form-control" />
                    </div>
                </div>
            </div>
            <!-- <ckeditor v-model="value" :editor="editor"></ckeditor> -->
            <button v-on:click.stop="change" class="btn btn btn-success  btn-sm float-right mt-1 ">
                <i class="fa fa-check"></i> Update
            </button>
        </div>
        <!-- <div>
            <div>
                <div style="float:left">{{name}}: {{value}}</div>
                <div>
                    <b-button  style="margin: 0px 0px 10px 10px" size="sm" variant="light" v-on:click="editFun"><i class=" ri-edit-box-line"></i></b-button>
                </div>
            </div>
            <div v-if="isEdit">
                <ckeditor v-model="value" :editor="editor"></ckeditor>
                <b-button v-on:click.stop="change" size="sm" class="btn btn-primary" style="float: right"><i class="fa fa-check"></i> update </b-button>
            </div>
        </div> -->
        <!-- <div class="attributeDiv">
            <p class="inline" v-show="!isEdit">
                <b>{{ name }}</b> : {{ value }} 
            </p>
            <b-button  @click="remove" size="sm" style="margin: 2px" class="btn btn-danger"><i class="fa fa-close" title="remove"></i> remove</b-button>
            <b-button  @click="edit" size="sm" style="margin: 2px" class="btn btn-info"><i class="fa fa-edit" title="edit"></i> edit</b-button>
            <div v-show="isEdit">
                    <ckeditor v-model="value" :editor="editor"></ckeditor>
                <b-button v-on:click.stop="change" size="sm" class="btn btn-primary"><i class="fa fa-check"></i> update </b-button>
            </div>
        </div> -->
    </div>
</template>

<script>
import { eventBus } from "../../../../main";
// import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import axios from "axios"
export default {
    props: {
        value: String,
        name: String,
    },
    // components: { ckeditor: CKEditor.component },
    data() {
        return {
            isEdit: false,
            editor: ClassicEditor,
            
        };
    },
    mounted() {
        this.editor.execute("removeFormat");
        
    },
    methods: {
        editFun() {
            if (this.isEdit) {
                this.isEdit = false;
            } else {
                this.isEdit = true;
            }
        },
        remove() {
            eventBus.$emit("edit", {
                editWay: "remove",
                name: this.name,
                value: this.value,
            });
        },
        edit() {
            this.isEdit = true;
        },
        change() {
            if (this.value == "") {
                alert("Please input some value!");
                return;
            }
            eventBus.$emit("edit", {
                editWay: "change",
                name: this.name,
                value: this.value,
            });
            this.isEdit = false;
        },
    },
};
</script>
<style scoped>
.bg-card {
    background-color: #3F979B;
}

.editor {
    /* border: 1px dashed #1cbb8c !important; */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
    border-radius: 10px 10px 0 0 !important;
}

.updatebtn {
    background-color: #1cbb8c !important
}

.tageditor {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.bg-card {
    background-color: #3F979B;
}

.card-header {
    background-color: #3F979B !important;
    color: #fff !important;
    border-radius: 10px 10px 0 0 !important;
    padding: 10px 20px !important;
}

.card-title {
    font-size: 1.2rem !important;
    font-weight: bold !important;
    margin: 0 !important;
}
</style>