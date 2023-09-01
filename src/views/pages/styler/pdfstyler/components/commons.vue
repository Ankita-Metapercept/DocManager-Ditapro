<template>
    <div>
        <h5 class="mb-2 text-primary  title p-2 bg-light  ">Chapter</h5>
        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="logo-alignment">Alignment</label>
                <multiselect v-model="frontmatter_title_commons.selectedAlignment"
                    :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="frontmatter_title_commons.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <multiselect v-model="frontmatter_title_commons.fontSize"
                    :options="frontmatter_title_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect v-model="frontmatter_title_commons.fontWeight"
                    :options="frontmatter_title_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                <multiselect v-model="frontmatter_title_commons.fontFamily"
                    :options="frontmatter_title_fonts.map(item => item.name)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="line-height">Line-Height</label>
                <multiselect v-model="frontmatter_title_commons.lineHeight"
                    :options="frontmatter_title_lineHeight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-before">Space-Before</label>
                <multiselect v-model="frontmatter_title_commons.spacebefore"
                    :options="frontmatter_title_space_before.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="letter-spacing">Letter-Spacing</label>
                <multiselect v-model="frontmatter_title_commons.letterSpacing"
                    :options="frontmatter_title_letter_spacing.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <h5 class="text-primary  title p-2 bg-light mb-2">Title</h5>

        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="alignment">Alignment</label>
                <multiselect v-model="frontmatter_title_commons.selectedAlignment"
                    :options="alignment.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="topic_title.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <multiselect v-model="topic_title.fontSize" :options="topic_title_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect v-model="topic_title.fontWeight" :options="topic_title_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="border">Border</label>
                <multiselect v-model="topic_title.borderafterWidth"
                    :options="topic_title_borderafterwidth.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Backgroud-Color</label>
                <input type="color" id="color" class="form-control" v-model="topic_title.background_color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                <multiselect v-model="topic_title.fontFamily" :options="topic_title_fonts.map(item => item.name)">
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
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
export default {
    props: {
        title: String,
        paragraph: String,
        formDataList: Array // Assuming you have a prop named 'formDataList' in your child component
    },
    components: {
        Multiselect
    },

    data() {
        return {
            rating: '',
            condition: true,
            frontmatter_title_commons: {
                selectedAlignment: null,
                color: null,
                fontSize: null,
                fontFamily: null,
                fontWeight: null,
                lineHeight: null,
                spacebefore: null,
                letterSpacing: null,
            },
            topic_title: {
                color: null,
                fontSize: null,
                fontWeight: null,
                borderafterWidth: null,
                background_color: null,
                fontFamily: null,
            },
            alignment: [{ id: 1, value: 'Left' }, { id: 2, value: 'Center' }, { id: 3, value: 'Right' }],
            topic_title_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            topic_title_borderafterwidth: [{ id: 1, value: '0pt' }, { id: 2, value: '1pt' }, { id: 3, value: '2pt' }, { id: 4, value: '3pt' }, { id: 5, value: '4pt' }, { id: 6, value: '5pt' }, { id: 7, value: '7pt' }, { id: 8, value: '9pt' }, { id: 9, value: '10pt' }, { id: 10, value: '12pt' }],
            topic_title_fontweight: [{ id: 1, value: '300' }, { id: 2, value: '400' }, { id: 3, value: '500' }, { id: 4, value: '600' }, { id: 5, value: '900' }],
            topic_title_fontsize: [{ id: 1, value: '8pt' }, { id: 2, value: '12pt' }, { id: 3, value: '16pt' }, { id: 4, value: '18pt' }, { id: 5, value: '24pt' }, { id: 6, value: '28pt' }, { id: 7, value: '32pt' }, { id: 8, value: '36pt' }, { id: 9, value: '42pt' }, { id: 10, value: '48pt' }],
            frontmatter_title_letter_spacing: [{ id: 1, value: '0pt' }, { id: 2, value: '1pt' }, { id: 3, value: '2pt' }, { id: 4, value: '3pt' }, { id: 5, value: '4pt' }],
            frontmatter_title_fontsize: [{ id: 1, value: '8pt' }, { id: 2, value: '12pt' }, { id: 3, value: '16pt' }, { id: 4, value: '18pt' }, { id: 5, value: '24pt' }, { id: 6, value: '28pt' }, { id: 7, value: '32pt' }, { id: 8, value: '36pt' }, { id: 9, value: '42pt' }, { id: 10, value: '48pt' }],
            frontmatter_title_fontweight: [{ id: 1, value: '300' }, { id: 2, value: '400' }, { id: 3, value: '500' }, { id: 4, value: '600' }, { id: 5, value: '900' }],
            frontmatter_title_lineHeight: [{ id: 1, value: '90%' }, { id: 2, value: '100%' }, { id: 3, value: '110%' }, { id: 4, value: '120%' }, { id: 5, value: '130%' }, { id: 6, value: '140%' }, { id: 7, value: '150%' }],
            frontmatter_title_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            frontmatter_title_space_before: [{ id: 1, value: '0mm' }, { id: 2, value: '20mm' }, { id: 3, value: '40mm' }, { id: 4, value: '60mm' }, { id: 5, value: '80mm' }, { id: 6, value: '100mm' }],
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
            title: "Commons",
            paragraph: "You can use these fields to design the technical manual's front cover pages.",
            icons:'mdi mdi-view-headline font-size-36 align-middle'
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
        sendHeader() {
            const data = {
                title: this.title,
                paragraph: this.paragraph,
                formDataList: this.formDataList
            };
            this.$emit('data-updated', data);
        },
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
            this.frontmatter_title_commons.selectedAlignment = null,
                this.frontmatter_title_commons.color = null,
                this.frontmatter_title_commons.fontSize = null,
                this.frontmatter_title_commons.fontFamily = null,
                this.frontmatter_title_commons.fontWeight = null,
                this.frontmatter_title_commons.lineHeight = null,
                this.frontmatter_title_commons.spacebefore = null,
                this.frontmatter_title_commons.letterSpacing = null,
                this.topic_title.color = null,
                this.topic_title.fontSize = null,
                this.topic_title.fontWeight = null,
                this.topic_title.borderafterWidth = null,
                this.topic_title.background_color = null,
                this.topic_title.fontFamily = null
        },
        onFileSelected(event) {
            this.frontmatter_logo.FrontmatterLogoFile = event.target.files[0];
        },
        nextForm() {
            this.$emit('next-form',)
            this.submitForm(),
                this.convertDataToLowerCase()
        },
        finalSubmit() {
            this.$emit('final-submit'),
                this.convertDataToLowerCase()
        },
        submitForm() {
            const formData = {
                frontmatter_title_commons: this.frontmatter_title,
                topic_title: this.topic_title,
            }
            this.$emit('form-submitnew', formData)
        },
    }
}
</script>
<style scoped>
.form-group{
    margin: 10px;
}
</style>
  