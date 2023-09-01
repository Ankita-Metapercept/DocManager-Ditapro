<template>
    <div>
        <h5 class="text-primary  title p-2 bg-light  mb-2">Header</h5>
        <h5 class="mb-0">Odd</h5>
        <b-card-body>
            <div class="form-group row">
                <b-col sm="6 mt-2 mb-0">
                    <label for="logo-alignment">Alignment</label>
                   
                    <multiselect v-model="static_content_oddheader.selectedAlignment"
                        :options="alignment.map(item => item.value)">
                    </multiselect>
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="color">Color</label>
                    <input type="color" id="color" class="form-control" v-model="static_content_oddheader.color">
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-family">Font-Family</label>
                    <multiselect v-model="static_content_pagenum.fontFamily"
                        :options="pagenum_fonts.map(item => item.name)">
                    </multiselect>
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="space-before">Space-Before</label>
                    <multiselect v-model="static_content_oddheader.spacebefore"
                        :options="staticcontent_oddheader_spacebefore.map(item => item.value)">
                    </multiselect>
                </b-col>
            </div>
        </b-card-body>
        <h5 class="mb-0 ">Even</h5>
        <b-card-body>
            <div class="form-group row">
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-family">Font-Family</label>
                    
                    <multiselect v-model="static_content_pagenum.fontFamily"
                        :options="pagenum_fonts.map(item => item.name)">
                    </multiselect>
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="color">Color</label>
                    <input type="color" id="static_content_evenheader.color" class="form-control"
                        v-model="static_content_evenheader.color">
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="space-before">Space-Before</label>
                   
                    <multiselect v-model="static_content_evenheader.spacebefore"
                        :options="staticcontent_evenheader_spacebefore.map(item => item.value)">
                    </multiselect>
                </b-col>
            </div>
        </b-card-body>

        <h5 class="text-primary  title p-2 bg-light  mb-2">Footer</h5>
        <h5 class="mb-0">Odd</h5>
        <b-card-body>
            <div class="form-group row">
                <b-col sm="6 mt-2 mb-0">
                    <label for="logo-alignment">Alignment</label>
                   
                    <multiselect v-model="static_content_oddfooter.selectedAlignment"
                        :options="alignment.map(item => item.value)">
                    </multiselect>
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="color">Color</label>
                    <input type="color" id="color" class="form-control" v-model="static_content_oddfooter.color">
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-family">Font-Family</label>
                   
                    <multiselect v-model="static_content_pagenum.fontFamily"
                        :options="pagenum_fonts.map(item => item.name)">
                    </multiselect>
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="space-after">Space-After</label>
                    
                    <multiselect v-model="static_content_oddfooter.spaceafter"
                        :options="staticcontent_oddfooter_spaceafter.map(item => item.value)">
                    </multiselect>
                </b-col>
            </div>
        </b-card-body>
        <h5 class="mb-0">Even</h5>
        <b-card-body>
            <div class="form-group row">
                <b-col sm="6 mt-2 mb-0">
                    <label for="font-family">Font-Family</label>
                   
                    <multiselect v-model="static_content_pagenum.fontFamily"
                        :options="pagenum_fonts.map(item => item.name)">
                    </multiselect>
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="color">Color</label>
                    <input type="color" id="color" class="form-control" v-model="static_content_evenfooter.color">
                </b-col>
                <b-col sm="6 mt-2 mb-0">
                    <label for="space-after">Space-After</label>
                    
                    <multiselect v-model="static_content_evenfooter.spaceafter"
                        :options="staticcontent_evenfooter_spaceafter.map(item => item.value)">
                    </multiselect>
                </b-col>
            </div>
        </b-card-body>
        <h5 class=" text-primary title p-2 bg-light mb-2">Page Number</h5>
        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                
                <multiselect v-model="static_content_pagenum.fontWeight"
                    :options="pagenum_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color-picker">Color</label>
                <input type="color" class="form-control" id="static_content_pagenum.color" name="color-picker"
                    v-model="static_content_pagenum.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                
                <multiselect v-model="static_content_pagenum.fontFamily" :options="pagenum_fonts.map(item => item.name)">
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
    props: ['formDataList'],
    components: {
        Multiselect
    },
    data() {
        return {
            rating: '',
            condition: true,
            alignment: [{ id: 1, value: 'Left' }, { id: 2, value: 'Center' }, { id: 3, value: 'Right' }],
            staticcontent_oddheader_spacebefore: [{ id: 1, value: "8pt" }, { id: 2, value: "10pt" }, { id: 3, value: "12pt" }, { id: 4, value: "16pt" }, { id: 5, value: "18pt" }, { id: 6, value: "24pt" }],
            pagenum_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            staticcontent_oddfooter_spaceafter: [{ id: 1, value: "8pt" }, { id: 2, value: "10pt" }, { id: 3, value: "12pt" }, { id: 4, value: "16pt" }, { id: 5, value: "18pt" }, { id: 6, value: "24pt" }],
            staticcontent_evenheader_spacebefore: [{ id: 1, value: "8pt" }, { id: 2, value: "10pt" }, { id: 3, value: "12pt" }, { id: 4, value: "16pt" }, { id: 5, value: "18pt" }, { id: 6, value: "24pt" }],
            pagenum_fontweight: [{ id: 1, value: '100' }, { id: 2, value: '300' }, { id: 3, value: '400' }, { id: 4, value: '700' }, { id: 5, value: '900' }],
            staticcontent_evenfooter_spaceafter: [{ id: 1, value: "8pt" }, { id: 2, value: "10pt" }, { id: 3, value: "12pt" }, { id: 4, value: "16pt" }, { id: 5, value: "18pt" }, { id: 6, value: "24pt" }],
            static_content_oddheader: {
                spacebefore: null,
                color: null,
                selectedAlignment: null,
            },
            static_content_evenheader: {
                color: null,
                spacebefore: null,
            },
            static_content_pagenum: {
                fontFamily: null,
                fontWeight: null,
                color: null
            },
            static_content_oddfooter: {
                color: null,
                selectedAlignment: null,
                spaceafter: null,
            },
            static_content_evenfooter: {
                color: null,
                spaceafter: null,
            }
        }
    },
    computed: {
        formattedMessage() {
            return {
                static_content_oddheader: this.static_content_oddheader,
                static_content_evenheader: this.static_content_evenheader,
                static_content_pagenum: this.static_content_pagenum,
                static_content_oddfooter: this.static_content_oddfooter,
                static_content_evenfooter: this.static_content_evenfooter,

            };
        },
    },
    mounted() {
        const data = {
            title: "Header/Footer",
            paragraph: "You can use these fields to design the technical manual's front cover pages.",
            icons:'mdi mdi-page-layout-header-footer font-size-26 align-middle mr-2'
        };
        this.$emit("data-mounted", data);
    },
    created() {
        // Call the updateFormData method with your formDataList
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
        refreshFormData() {
            this.static_content_oddheader.spacebefore = null,
                this.static_content_oddheader.color = null,
                this.static_content_oddheader.selectedAlignment = null,
                this.static_content_evenheader.color = null,
                this.static_content_evenheader.spacebefore = null,
                this.static_content_pagenum.fontFamily = null,
                this.static_content_pagenum.fontWeight = null,
                this.static_content_pagenum.color = null,
                this.static_content_oddfooter.color = null,
                this.static_content_oddfooter.spaceafter = null,
                this.static_content_evenfooter.color = null,
                this.static_content_evenfooter.spaceafter = null

        },
        updateFormData(formDataList) {
            for (const key in formDataList) {
                if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
                    this[key] = formDataList[key];
                }
            }
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
                static_content_oddheader: this.static_content_oddheader,
                static_content_evenheader: this.static_content_evenheader,
                static_content_pagenum: this.static_content_pagenum,
                static_content_oddfooter: this.static_content_oddfooter,
                static_content_evenfooter: this.static_content_evenfooter,
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
</style>
  