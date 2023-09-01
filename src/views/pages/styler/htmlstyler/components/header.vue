<template>
    <div>
        <h5 class="text-primary title  p-2 bg-light  mb-2">Logo</h5>
        <div class="form-group row">
            <b-col sm="6">
                <label for="logo-image">Logo</label>
                <input type="file" class="form-control-file" id="logo-image" name="logo-image" @change="onFileSelected">
            </b-col>
            <b-col sm="6">
                <label for="size">Size</label>
                <!-- <select class="form-control" id="topictitle1Attr.backgroundsize" name="size"
                    v-model="topictitle1Attr.backgroundsize">
                    <option v-for="option in topictitle1_backgroundImgSize" :key="option.id" :value="option.value">
                        {{ option.value }}</option>
                </select> -->
                <multiselect v-model="topictitle1Attr.backgroundsize"
                    :options="topictitle1_backgroundImgSize.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <h5 class="text-primary p-2 bg-light ">Title</h5>

        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="alignment">Alignment</label>
                <!-- <select id="alignment" class="form-control" v-model="topictitle1Attr.selectedAlignment" >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select> -->
                <multiselect v-model="topictitle1Attr.selectedAlignment" :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="background-colo">Background-Color</label>
                <input type="color" id="color" class="form-control" v-model="topictitle1Attr.map_title_backgroundcolor">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                <!-- <select class="form-control" id="topictitle1Attr.fontFamily" name="font-family"
                    v-model="topictitle1Attr.fontFamily">
                    <option v-for="option in topictitle1_fonts" :key="option.id" :value="option.value">
                        {{ option.name }}</option>
                </select> -->
                <multiselect v-model="topictitle1Attr.fontFamily" :options="topictitle1_fonts.map(item => item.name)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="colo">Font-Color</label>
                <input type="color" id="color" class="form-control" v-model="topictitle1Attr.map_title_fontcolor">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <!-- <select class="form-control" id="topic_title.fontSize" name="font-size" v-model="topictitle1Attr.fontSize">
                    <option v-for="option in topictitle1_fontsize" :key="option.id" :value="option.value">
                        {{ option.value }}</option>
                </select> -->
                <multiselect v-model="topictitle1Attr.fontSize" :options="topictitle1_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <div class="d-flex justify-content-end mt-3">
            <div class="col-sm-auto">
                <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="confirm()">Submit</b-button>
            </div>
            <div class="col-sm-auto">
                <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="nextForm()">Next</b-button>
            </div>
            <div class="col-sm-auto">
                <b-button size="sm" variant="danger" class="w-100 mb-2" @click.prevent="refreshFormData()">Reset</b-button>
            </div>
        </div>
        <!-- {{ formattedMessage }} -->
    </div>
</template>
  
<script>
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
export default {
    props: {
        formDataList: {
            type: Object,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        paragraph: {
            type: String,
            required: true,
        },
    },
    components: {
        Multiselect
    },
    data() {
        return {
            topictitle1Attr: {
                logoName: null,
                selectedAlignment: null,
                backgroundsize: null,
                fontFamily: null,
                map_title_backgroundcolor: null,
                map_title_fontcolor: null,
                fontSize: null,
            },
            rating: '',
            condition: true,
            //font-size
            topictitle1_fontsize: [{ id: 1, value: '8pt' }, { id: 2, value: '12pt' }, { id: 3, value: '16pt' }, { id: 4, value: '18pt' }, { id: 5, value: '24pt' }, { id: 6, value: '28pt' }, { id: 7, value: '32pt' }, { id: 8, value: '36pt' }, { id: 9, value: '42pt' }, { id: 10, value: '48pt' }],
            alignment: [{ id: 1, value: 'Left' }, { id: 2, value: 'Center' }, { id: 3, value: 'Right' }],
            //font-family
            topictitle1_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            topictitle1_backgroundImgSize: [{ id: 1, name: '60px', value: '60px' }, { id: 2, name: '70px', value: '70px' }, { id: 3, name: '80px', value: '80px' }, { id: 4, name: '90px', value: '90px' }, { id: 5, name: '100px', value: '100px' }],
        }
    },
    created() {
        // Call the updateFormData method with your formDataList
        this.updateFormData(this.formDataList);
    },
    beforeDestroy() {
        this.submitForm();
    },
    mounted() {
        const data = {
            title: "Header",
            paragraph: "You can use these fields to design the technical manual's front cover pages.",
            icons:'mdi mdi-page-layout-header font-size-26 align-middle'
        };
        this.$emit("data-mounted", data);
    },

    computed: {
        formattedMessage() {
            return {
                frontmatter_title_commons: this.frontmatter_title,
                topic_title: this.topic_title,
            };
        },
    },
    methods: {
        convertDataToLowerCase() {
            const dataKeys = Object.keys(this.$data);
            for (const key of dataKeys) {
                const obj = this.$data[key];
                if (typeof obj === "object" && obj !== null) {
                    const keys = Object.keys(obj);
                    for (const innerKey of keys) {
                        if (obj[innerKey] !== null && typeof obj[innerKey] === "string") {
                            obj[innerKey] = obj[innerKey].toLowerCase();
                        }
                    }
                }
            }
        },
        async confirm() {
            if (this.condition) {
                this.submitForm()
                await Swal.fire({
                    title: "Are you sure?",
                    text: "You want to make final changes.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.finalSubmit()
                    } else if (result.dismiss === Swal.DismissReason.cancel) {

                        console.log("cancle from alert");
                    }
                });
            }
        },
        updateFormData(formDataList) {
            for (const key in formDataList) {
                if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
                    this[key] = formDataList[key];
                }
            }
        },
        refreshFormData() {
            this.topictitle1Attr.selectedAlignment = null,
                this.topictitle1Attr.backgroundsize = null,
                this.topictitle1Attr.fontFamily = null,
                this.topictitle1Attr.map_title_backgroundcolor = null,
                this.topictitle1Attr.map_title_fontcolor = null,
                this.topictitle1Attr.fontSize = null
        },
        onFileSelected(event) {
            const file = event.target.files[0];
            const fileSize = file.size / 1024 / 1024;
            if (fileSize > 3) {
                Swal.fire({
                    icon: 'error',
                    title: 'File size should not exceed 3 MB',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                event.target.value = null;
            } else {
                const formData = new FormData();
                formData.append('HtmlLogo', file);
                this.topictitle1Attr.logoName = file.name
                console.log('Selected file:', this.topictitle1Attr.logoName); // log the file name
                const userId = localStorage.getItem("userId");
                const orgId = localStorage.getItem("orgId");
                this.$store.getters.client.post(`/orguser/docstyler/uploadHtmlLogo?userId=${userId}&orgId=${orgId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    });
            }
        },
        nextForm() {
            this.$emit('next-form',)
            this.submitForm()
            this.convertDataToLowerCase()
        },
        finalSubmit() {
            this.$emit('final-submit'),
                this.convertDataToLowerCase()
        },
        submitForm() {
            const formData = {
                topictitle1Attr: this.topictitle1Attr,
            }
            this.$emit('form-submitnew', formData)
        },
    }
}
</script>
<style scoped>
.star-rating {
    display: inline-block;
}

.star {
    color: orange;
    cursor: pointer;
    position: relative;
    top: -17px;
    bottom: 0px;
}

.filled {
    color: orange;
}
.form-group{
    margin: 10px;
}
</style>
    