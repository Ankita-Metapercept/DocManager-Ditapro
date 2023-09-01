<template>
    <div>
        <h5 class="text-primary title p-2 bg-light mb-2">Title</h5>
        <div class="form-group row ">
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight pt-1">Font-Weight</label>
                <multiselect  v-model="table_title.fontWeight"
                    :options="table_title_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-size">Font-Size</label>
                <multiselect  v-model="table_title.fontSize"
                    :options="table_title_fontsize.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="logo-size ">Font-Family</label>
                <multiselect  v-model="table_title.fontFamily"
                    :options="table_title_fonts.map(item => item.name)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="table_title.color">
            </b-col>
        </div>
        <h5 class="text-primary  title p-2 bg-light  mb-2">Headers</h5>
        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect  v-model="table_header.fontWeight"
                    :options="table_header_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="table_header.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="font-family">Font-Family</label>
                <multiselect  v-model="table_header.fontFamily"
                    :options="table_header_fonts.map(item => item.name)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Backgroud-Color</label>
                <input type="color" id="color" class="form-control" v-model="table_header.background_color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="Alignment">Alignment</label>
                
                <multiselect  v-model="table_header.selectedAlignment"
                    :options="alignment.map(item => item.value)">
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
            table_title: {
                fontWeight: null,
                fontSize: null,
                fontFamily: null,
                color: null,
            },
            table_header: {
                fontWeight: null,
                color: null,
                fontFamily: null,
                background_color: null,
                selectedAlignment: null,
            },
            // table_allframe: {
            //     frameStyle: null,
            //     borderTopWidth: null,
            //     frameColor: null,
            // },
            alignment: [{ id: 1, value: 'Left' }, { id: 2, value: 'Center' }, { id: 3, value: 'Right' }],
            table_title_fontweight: [{ id: 1, value: '100' }, { id: 2, value: '300' }, { id: 3, value: '400' }, { id: 4, value: '700' }, { id: 5, value: '900' }],
            table_header_fontweight: [{ id: 1, value: '100' }, { id: 2, value: '300' }, { id: 3, value: '400' }, { id: 4, value: '700' }, { id: 5, value: '900' }],
            table_header_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            table_framealltop_borderWidth: [{ id: 1, value: '0pt', name: 'No Borders' }, { id: 2, value: '1pt', name: '1 pt' }, { id: 3, value: '2pt', name: '2 pt' }, { id: 4, value: '3pt', name: '3 pt' }, { id: 5, value: '4pt', name: '4 pt' }, { id: 6, value: '5pt', name: '5 pt' }],
            table_title_fonts: [{ id: 1, name: 'Serif', value: 'serif' }, { id: 2, name: 'Sans-serif', value: 'sans-serif' }, { id: 3, name: 'Monospace', value: 'monospace' }, { id: 4, name: 'Helvetica', value: 'Helvetica' }, { id: 5, name: 'Courier', value: 'Courier' }],
            table_title_fontsize: [{ id: 1, value: '8pt' }, { id: 2, value: '12pt' }, { id: 3, value: '16pt' }, { id: 4, value: '18pt' }, { id: 5, value: '24pt' }, { id: 6, value: '28pt' }, { id: 7, value: '32pt' }, { id: 8, value: '36pt' }, { id: 9, value: '42pt' }, { id: 10, value: '48pt' }],
            table_title_framestyle: [{ id: 1, value: 'Framed' }, { id: 2, value: 'Outlines' }, { id: 3, value: 'Frameless' }],
        }
    },
    computed: {
        formattedMessage() {
            return {
                table_title: this.table_title,
                table_header: this.table_header,
                table_allframe: this.table_allframe,
            };
        },
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
            title: "Tables",
            paragraph: "You can use these fields to design various components of a table",
            icons:'mdi mdi-table-large font-size-26 align-middle mr-2'
        };
        this.$emit("data-mounted", data);
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
        nextForm() {
            this.$emit('next-form',)
            this.submitForm(),
            this.convertDataToLowerCase()
        },
        finalSubmit() {
            this.$emit('final-submit'),
            this.convertDataToLowerCase()
        },
        refreshFormData() {
            this.table_title.fontWeight = null,
                this.table_title.fontSize = null,
                this.table_title.fontFamily = null,
                this.table_title.color = null,
                this.table_header.fontWeight = null,
                this.table_header.selectedAlignment = null,
                this.table_header.color = null,
                this.table_header.fontFamily = null,
                this.table_header.background_color = null,
                this.table_allframe.frameStyle = null,
                this.table_allframe.borderTopWidth = null,
                this.table_allframe.frameColor = null
        },
        submitForm() {
            const formData = {
                table_title: this.table_title,
                table_header: this.table_header,
                table_allframe: this.table_allframe,
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

.form-group {
    margin: 10px;
}
</style>
  