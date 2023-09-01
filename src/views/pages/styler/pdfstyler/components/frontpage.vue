<template>
    <div>
        <h5 class="mb-0  title p-2 bg-light   text-primary mb-2">Logo</h5>
        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="logo-image">Image</label>
                <input type="file" class="form-control-file" id="logo-image" name="logo-image" @change="onFileSelected">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="Alignment">Alignment</label>
                <multiselect v-model="frontmatter_logo.selectedAlignment" :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="logo-size">Logo-Size</label>
                <multiselect v-model="frontmatter_logo.width" :options="frontmatter_logo_width.map(item => item.name)">
                </multiselect>
            </b-col>
        </div>

        <h5 class="mb-0  title p-2 bg-light   text-primary mb-2">Title</h5>

        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="alignment">Alignment</label>
                <multiselect v-model="frontmatter_title.selectedAlignment" :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="frontmatter_title.color" class="form-control" v-model="frontmatter_title.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <multiselect v-model="frontmatter_title.fontSize"
                    :options="frontmatter_title_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect v-model="frontmatter_title.fontWeight"
                    :options="frontmatter_title_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                <multiselect v-model="frontmatter_title.fontFamily"
                    :options="frontmatter_title_fonts.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="line-height">Line-Height</label>
                <multiselect v-model="frontmatter_title.lineHeight"
                    :options="frontmatter_title_fonts.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-before">Space-Before</label>
                <multiselect v-model="frontmatter_title.spacebefore"
                    :options="frontmatter_title_space_before.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="letter-spacing">Letter-Spacing</label>
                <multiselect v-model="frontmatter_title.letterSpacing"
                    :options="frontmatter_title_letter_spacing.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <h5 class=" text-primary  title p-2 bg-light  mb-2">Subtitle</h5>

        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="alignment">Alignment</label>
                <multiselect v-model="frontmatter_subtitle.selectedAlignment" :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color-picker">Color</label>
                <input type="color" class="form-control" id="frontmatter_subtitle.color" name="color-picker"
                    v-model="frontmatter_subtitle.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <multiselect v-model="frontmatter_subtitle.fontSize"
                    :options="frontmatter_subtitle_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect v-model="frontmatter_subtitle.fontWeight"
                    :options="frontmatter_subtitle_fontweight.map(item => item.value)">
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
    </div>
</template>
  
<script>
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
export default {
    props: ['formDataList'],
    components: {
        Multiselect
    },
    data() {
        return {
            rating: '',
            condition: true,
            alignment: [{ id: 1, value: 'Left' }, { id: 2, value: 'Center' }, { id: 3, value: 'Right' }],
            frontmatter_logo_width: [{ id: 1, value: '100px', name: 'Small' }, { id: 2, value: '200px', name: 'Medium' }, { id: 3, value: '300px', name: 'Large' }],
            frontmatter_title_fontsize: [{ id: 1, value: '8pt' }, { id: 2, value: '12pt' }, { id: 3, value: '16pt' }, { id: 4, value: '18pt' }, { id: 5, value: '24pt' }, { id: 6, value: '28pt' }, { id: 7, value: '32pt' }, { id: 8, value: '36pt' }, { id: 9, value: '42pt' }, { id: 10, value: '48pt' }],
            frontmatter_title_fontweight: [{ id: 1, value: '300' }, { id: 2, value: '400' }, { id: 3, value: '500' }, { id: 4, value: '600' }, { id: 5, value: '900' }],
            frontmatter_title_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'Sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            frontmatter_title_lineHeight: [{ id: 1, value: '90%' }, { id: 2, value: '100%' }, { id: 3, value: '110%' }, { id: 4, value: '120%' }, { id: 5, value: '130%' }, { id: 6, value: '140%' }, { id: 7, value: '150%' }],
            frontmatter_title_space_before: [{ id: 1, value: '0mm' }, { id: 2, value: '20mm' }, { id: 3, value: '40mm' }, { id: 4, value: '60mm' }, { id: 5, value: '80mm' }, { id: 6, value: '100mm' }],
            frontmatter_title_letter_spacing: [{ id: 1, value: '0pt' }, { id: 2, value: '1pt' }, { id: 3, value: '2pt' }, { id: 4, value: '3pt' }, { id: 5, value: '4pt' }],
            frontmatter_subtitle_fontsize: [{ id: 1, value: '8pt' }, { id: 2, value: '12pt' }, { id: 3, value: '16pt' }, { id: 4, value: '18pt' }, { id: 5, value: '24pt' }, { id: 6, value: '28pt' }, { id: 7, value: '32pt' }, { id: 8, value: '36pt' }, { id: 9, value: '42pt' }, { id: 10, value: '48pt' }],
            frontmatter_subtitle_fontweight: [{ id: 1, value: '300' }, { id: 2, value: '400' }, { id: 3, value: '500' }, { id: 4, value: '600' }, { id: 5, value: '900' }],
            frontmatter_logo: {
                FrontmatterLogoFile: null,
                width: null,
                selectedAlignment: null,
            },
            frontmatter_title: {
                selectedAlignment: null,
                color: null,
                fontSize: null,
                fontWeight: null,
                fontFamily: null,
                lineHeight: null,
                spacebefore: null,
                letterSpacing: null,
            },
            frontmatter_subtitle: {
                selectedAlignment: null,
                color: null,
                fontSize: null,
                fontWeight: null,
            }
        }
    },
    computed: {
        formattedMessage() {
            return {
                frontmatter_logo: this.frontmatter_logo,
                frontmatter_title: this.frontmatter_title,
                frontmatter_subtitle: this.frontmatter_subtitle
            };
        },
    },
    mounted() {
        const data = {
            title: "Front Page",
            paragraph: "You can use these fields to design the technical manual's front cover pages.",
            icons: 'mdi mdi-home font-size-26 align-middle mr-2'
        };
        this.$emit("data-mounted", data);
    },
    created() {
        this.updateFormData(this.formDataList);
    },
    beforeDestroy() {
        this.submitForm();
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
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.finalSubmit()
                        console.log("hii from alerst");
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
        onFileSelected(event) {
            const file = event.target.files[0];
            const fileSize = file.size / 1024 / 1024;
            if (fileSize > 3) {
                Swal.fire({
                    icon: 'error',
                    title: 'File size should not exceed 1 MB',
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
                formData.append('pdfCoverLogo', file);
                this.frontmatter_logo.FrontmatterLogoFile = file.name
                console.log('Selected file:', this.frontmatter_logo.FrontmatterLogoFile); // log the file name
                const userId = localStorage.getItem("userId");
                const orgId = localStorage.getItem("orgId");
                this.$store.getters.client.post(`/orguser/docstyler/uploadPdfLogo?userId=${userId}&orgId=${orgId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        refreshFormData() {
            this.frontmatter_logo.FrontmatterLogoFile = 'pdfCoverLogo',
                this.frontmatter_logo.width = null,
                this.frontmatter_logo.selectedAlignment = null,
                this.frontmatter_title.selectedAlignment = null,
                this.frontmatter_title.color = null,
                this.frontmatter_title.fontSize = null,
                this.frontmatter_title.fontWeight = null,
                this.frontmatter_title.fontFamily = null,
                this.frontmatter_title.lineHeight = null,
                this.frontmatter_title.spacebefore = null,
                this.frontmatter_title.letterSpacing = null,
                this.frontmatter_subtitle.selectedAlignment = null,
                this.frontmatter_subtitle.color = null,
                this.frontmatter_subtitle.fontSize = null,
                this.frontmatter_subtitle.fontWeight = null
        },
        nextForm() {
            this.$emit('next-form',)
            this.submitForm(),
                this.convertDataToLowerCase()
        },
        submitForm() {
            const formData = {
                frontmatter_logo: this.frontmatter_logo,
                frontmatter_title: this.frontmatter_title,
                frontmatter_subtitle: this.frontmatter_subtitle
            }
            this.$emit('form-submitnew', formData)
        },
        finalSubmit() {
            this.$emit('final-submit'),
                this.convertDataToLowerCase()
        },
        handleprogress() {
            this.$emit("start-progress", {});
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

.form-group {
    margin: 10px;
}

.filled {
    color: orange;
}
</style>
  