<template>
    <div>
        <h5 class="text-primary  title p-2 bg-light  mb-2">Unordered</h5>
        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect v-model="List_ul.fontWeight" :options="listUL_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="List_ul.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-before">Space-Before</label>
                <multiselect v-model="List_ul.spacebefore" :options="listUL_space_before.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-after">Space-After</label>
                <multiselect v-model="List_ul.spaceafter" :options="listUL_space_after.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-before">Bullets</label>
                <multiselect v-model="List_ul.ul_bullets" :options="listUL_bullets.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <h5 class="text-primary  title p-2 bg-light   mb-2">Ordered</h5>
        <div class="form-group row">
            <b-col sm="6 mt-2 mb-0">
                <label for="font-weight">Font-Weight</label>
                <multiselect v-model="List_ol.fontWeight" :options="listOL_fontweight.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="color">Color</label>
                <input type="color" id="color" class="form-control" v-model="List_ol.color">
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-before">Space-Before</label>
                <multiselect v-model="List_ol.spacebefore" :options="listOL_space_before.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="space-after">Space-After</label>
                <multiselect v-model="List_ol.spaceafter" :options="listOL_space_after.map(item => item.value)">
                </multiselect>
            </b-col>
            <b-col sm="6 mt-2 mb-0">
                <label for="bullets">Bullets</label>
                <multiselect v-model="List_ol.bullets" :options="ol_bullets.map(item => item.value)">
                </multiselect>
            </b-col>
        </div>
        <div class="d-flex justify-content-end mt-3">
            <div class="col-sm-auto">
                <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="confirm()">Submit</b-button>
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
            condition: true,
            rating: '',
            List_ul: {
                fontWeight: null,
                color: null,
                spacebefore: null,
                spaceafter: null,
                ul_bullets: null,
            },
            List_ol: {
                fontWeight: null,
                color: null,
                spacebefore: null,
                spaceafter: null,
                bullets: null,
            },
            //<--------------------options for lists--------------------->
            //UL
            listUL_fontweight: [{ id: 1, value: '300' }, { id: 2, value: '400' }, { id: 3, value: '500' }, { id: 4, value: '600' }, { id: 5, value: '700' }, { id: 6, value: '900' }],
            listUL_space_before: [{ id: 1, value: '1.5pt' }, { id: 2, value: '2pt' }, { id: 3, value: '3.5pt' }, { id: 4, value: '5pt' }, { id: 5, value: '6.5pt' }, { id: 6, value: '8pt' }, { id: 7, value: '9pt' }, { id: 8, value: '10pt' }],
            listUL_space_after: [{ id: 1, value: '1.5pt' }, { id: 2, value: '2pt' }, { id: 3, value: '3.5pt' }, { id: 4, value: '5pt' }, { id: 5, value: '6.5pt' }, { id: 6, value: '8pt' }, { id: 7, value: '9pt' }, { id: 8, value: '10pt' }],
            //OL
            listOL_fontweight: [{ id: 1, value: '300' }, { id: 2, value: '400' }, { id: 3, value: '500' }, { id: 4, value: '600' }, { id: 5, value: '700' }, { id: 6, value: '900' }],
            listOL_space_before: [{ id: 1, value: '1.5pt' }, { id: 2, value: '2pt' }, { id: 3, value: '3.5pt' }, { id: 4, value: '5pt' }, { id: 5, value: '6.5pt' }, { id: 6, value: '8pt' }, { id: 7, value: '9pt' }, { id: 8, value: '10pt' }],
            listOL_space_after: [{ id: 1, value: '1.5pt' }, { id: 2, value: '2pt' }, { id: 3, value: '3.5pt' }, { id: 4, value: '5pt' }, { id: 5, value: '6.5pt' }, { id: 6, value: '8pt' }, { id: 7, value: '9pt' }, { id: 8, value: '10pt' }],
            ol_bullets: [{ id: 1, value: '1', name: 'Numeric' }, { id: 2, value: 'I', name: 'Roman' }, { id: 3, value: 'A', name: 'Capital Alphabet' }, { id: 4, value: 'a', name: 'Small Aplphabet' }],
            listUL_bullets: [{ id: 1, value: '•', }, { id: 2, value: '⇒' }, { id: 3, value: '—', }, { id: 4, value: '★' }, { id: 5, value: '→' }]
            //<-------------------options for lists ends---------------------->
        }
    },
    computed: {
        formattedMessage() {
            return {
                List_ul: this.List_ul,
                List_ol: this.List_ol,
            };
        },
    },
    created() {
        this.updateFormData(this.formDataList);
    },
    beforeDestroy() {
        this.submitForm();
    },
    mounted() {
        const data = {
            title: "Lists",
            paragraph: "You can use these fields to design the Lists.",
            icons: 'mdi mdi-format-list-bulleted font-size-26 align-middle'
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
        refreshFormData() {
            this.List_ul.fontWeight = null,
                this.List_ul.color = null,
                this.List_ul.spacebefore = null,
                this.List_ul.spaceafter = null,
                this.List_ul.ul_bullets = null,
                this.List_ol.fontWeight = null,
                this.List_ol.color = null,
                this.List_ol.spacebefore = null,
                this.List_ol.spaceafter = null,
                this.List_ol.bullets = null
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
                List_ul: this.List_ul,
                List_ol: this.List_ol,
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
  