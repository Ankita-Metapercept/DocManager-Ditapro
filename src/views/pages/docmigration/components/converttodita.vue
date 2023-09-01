<template>
    <div>
        <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
            <div class="card">
                <div class="card-body">
                    <p>Please wait while your file is being converted to DITA.</p>
                    <b-progress :value="progress" :max="100" style="height:5px;"></b-progress>
                </div>
            </div>
        </b-modal>
        <div>
            <b-modal ref="my-modal" hide-footer title="important message" hide-close no-close-on-backdrop no-close-on-esc>
                <div class="d-block text-center">
                    <h6>
                        "I'm sorry, It seems that the formatting of your Word file is not correct, which may be causing some
                        issues.
                        In order to rectify this, you will need to adjust the formatting to ensure that it meets the
                        required standards.
                        Once you have made the necessary changes, please try again.
                    </h6>
                </div>
                <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Go Back</b-button>
            </b-modal>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title  text-white mb-0">
                        <i class="fa fa-fw fa-cog me-2"></i>Source word file selection
                    </h5>
                </div>
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="col-md-12">
                            <form>
                                <div class="form-group row">
                                    <label class="col-md-12 col-form-label">Select File<span
                                            class="text-danger">*</span></label>
                                    <div class="col-md-12">
                                        <select class="form-control" v-model="selectedfolder" :value="foldername"
                                            placeholder="Select DITA-OT version" required>
                                            <option value="" disabled selected>Select File</option>
                                            <option v-for="(version, index) in foldername" :key="index"
                                                :value="version.value">
                                                {{ version.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg btn-block px-4 me-1 mb-3"
                                    @click.prevent="selectedfolder !== '' && convertToDita()"><i
                                        class="fa fa-fw fa-rocket me-2"></i>Convert Now</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import _ from "lodash";
export default {
    data() {
        return {
            progress: 0,
            selectedfolder: "",
            foldername: [],
            userId: localStorage.getItem("userId"),
            orgId: localStorage.getItem("orgId"),
        };
    },
    computed: {
        _() {
            return _;
        },
    },
    mounted() {
        this.getfoldernames()
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getfoldernames() {
            let loader = this.$loading.show({
                loader: "dots"
            });
            this.$store.getters.client.get(`/orguser/wordToDita/getExtractedFolderList?orgId=${this.orgId}&userId=${this.userId}`)
                .then(response => {
                    response.data.forEach((ele) => {
                        this.foldername.push({
                            value: ele.folderName,
                            text: ele.folderName,
                        })
                    })
                    loader.hide();
                })
                .catch(error => {
                    console.error(error);
                    loader.hide();
                });
        },
        hideModal() {
            this.$router.push({ path: `/docmigration` });
        },
        convertToDita() {
            this.progress = 0;
            const body = {
                userId: localStorage.getItem("userId"),
                orgId: localStorage.getItem("orgId"),
                folderName: this.selectedfolder,
            }
            const targetProgress = 100;
            const totalTime = 5000;
            const increment = (targetProgress / totalTime) * 50;

            const intervalId = setInterval(() => {
                if (this.progress < targetProgress) {
                    this.progress += increment;
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
            this.$refs["modaloutputprogress"].show();
            this.$store.getters.client.post("/orguser/wordToDita/convertToDita", body)
                .then(response => {
                    setTimeout(() => {
                        this.$refs["modaloutputprogress"].hide();
                    }, 2000)
                    console.log("convert to dita", response);
                    this.foldername = response.data
                    this.messageToast(
                        "Success",
                        "success",
                        response.data.message
                    );
                    setTimeout(() => {
                        this.$router.push({ path: `/docmigration/converttodita/outputscreen/${this.selectedfolder}` });
                        this.$refs["modaloutputprogress"].hide();
                    }, 2000);
                })
                .catch(error => {
                    console.error(error);

                    setTimeout(() => {
                        this.$refs["modaloutputprogress"].hide();
                    }, 3000);
                    setTimeout(() => {
                        this.$refs['my-modal'].show();
                    }, 2000);
                });
        }
    }
}
</script>
  
<style scoped>
.btn-primary {
    background-color: #2b313f !important;
    color: #fff !important;
    transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
    background-color: #4c5aa7 !important;
}
</style>
  