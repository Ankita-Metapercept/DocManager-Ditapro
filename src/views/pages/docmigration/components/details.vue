<template>
  <div>

    <b-modal id="modal-progress" ref="modaloutputprogress2" title="Processing" title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
      <div class="card">
        <div class="card-body">
          <strong>Please wait</strong>
          <br />
          <p>
            Please wait while your file is being converted to DITA.</p>
          <b-progress :value="progress" :max="100" style="height:5px;"></b-progress>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-footer hide-close no-close-on-backdrop no-close-on-esc>
      <div class="card">
        <div class="card-body">
          <p>
            Please wait while your file is being uploaded. Thank you for your patience.</p>
          <!-- <p>Converting to dita</p> -->
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

    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <div>
            <h6>Upload Word File<span class="text-danger">*</span></h6>
          </div>
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="drop-zone" :class="{ dragging: dragging }" @dragover.prevent @dragenter="dragging = true"
              @dragleave="dragging = false" @drop="handleDrop">
              <div class="drop-zone-inner">
                <div v-if="!fileSelected" class="text-center">
                  <i class="ri-file-word-2-line ri-4x word-icon"></i>
                  <p class="mt-2">Drag and drop your word file here</p>
                </div>
                <div v-if="fileSelected" class="text-center">
                  <i class="ri-file-word-2-line ri-4x word-icon"></i>
                </div>
                <div v-if="fileSelected" class="alert alert-success m-2" role="alert">
                  <p v-if="fileName">Selected file : {{ fileName }}</p>
                </div>
              </div>
              <input v-if="!fileSelected" type="file" @change="handleFileInput" class="d-none" ref="fileInput"
                name="wordFile" accept=".docx," />
              <button v-if="!fileSelected" type="button" class="btn card-icons-btn mb-2" @click="openFileInput">
                Browse File to Upload
              </button>
            </div>
            <div class="text-center pt-2">
              <div v-if="!showConvertbtn">
                <p v-if="!fileName">Accepted file type: .docx only </p>
                <button type="button" class="btn btn-success mr-3" :disabled="!fileSelected" @click="sendFileToServer"><i
                    class="fa fa-fw fa-upload me-1"></i> Upload</button>
                <button type="button" class="btn btn-secondary" @click="cancelForm">
                  <i class="fa fa-fw fa-times me-1"></i>Reset
                </button>
              </div>

              <button v-if="showConvertbtn" class="btn btn-success btn-lg" @click.prevent="convertToDita()">
                Convert Now
              </button>

            </div>
          </form>
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
      dragging: false,
      file: null,
      fileName: null,
      fileSelected: false,
      uploadPercentage: 0,
      showConvertbtn: false
    };
  },
  computed: {
    _() {
      return _;
    },
  },
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    handleDrop(e) {
      e.preventDefault();
      this.dragging = false;
      const file = e.dataTransfer.files[0];
      if (file) {
        if (
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword"
        ) {
          this.file = file;
          this.fileName = file.name;
          this.fileSelected = true;

        } else {
          this.messageToast("Error", "danger", "Please select a valid Word file.");
          this.file = null;
          this.fileName = null;
          this.fileSelected = false;
        }
      }
    },
    handleFileInput(e) {
      const file = e.target.files[0];
      if (file) {
        if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          this.file = file;
          this.fileName = file.name;
          this.fileSelected = true;

        } else {
          this.messageToast(
            "Error",
            "danger",
            "Please select a valid Word file."
          );
          e.target.value = null;
          this.fileSelected = false;
        }
      }
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    sendFileToServer() {
      this.progress = 0;
      const formData = new FormData();
      formData.append("wordFile", this.file);
      const userId = localStorage.getItem("userId");
      const orgId = localStorage.getItem("orgId");
      this.$refs["modaloutputprogress"].show();
      console.log(userId);
      this.$store.getters.client
        .post(
          `/orguser/wordToDita/uploadWordFileExtracts?userId=${userId}&orgId=${orgId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log(typeof response.data.message);
          const targetProgress = 100;
          const totalTime = 5000; // 5 seconds in milliseconds
          const increment = (targetProgress / totalTime) * 50;
          const intervalId = setInterval(() => {
            if (this.progress < targetProgress) {
              this.progress += increment;
            } else {
              clearInterval(intervalId);
            }
          }, 50);

          if (typeof response.data.message !== "object") {
            setTimeout(() => {
              this.$refs["modaloutputprogress"].hide();
              this.showConvertbtn = true
              this.fileSelected = true
              this.messageToast(
                "Success",
                "success",
                "Word file uploaded successfully",
              );

            }, 2000);
          }
          else {
            setTimeout(() => {
              this.$refs["modaloutputprogress"].hide();
              this.showConvertbtn = true
              this.fileSelected = true
              this.messageToast(
                "Success",
                "success",
                "Word file uploaded successfully",
              );
              if (typeof response.data.message === "object") {
                setTimeout(() => {
                  // this.$router.push({ path: "/docmigration/converttodita" });
                }, 5000);
              }
            }, 5000);
          }

          this.file = null;
          this.dragging = false;
          this.formData = null;
        })
        .catch((error) => {
          setTimeout(() => {
            this.$refs["modaloutputprogress"].hide();
          }, 5000);
          this.messageToast(
            "Invalid request",
            "danger",
            error.response.data.message
          );
          this.file = null;
          this.dragging = false;
          this.fileName = null;
          this.formData = null;
          this.fileSelected = false;
          this.file = null;
          this.dragging = false;
          this.formData = null;
          console.log(error);
        });
    },
    submitForm() {
      if (this.file) {
        this.sendFileToServer();
      }
    },
    cancelForm() {
      this.file = null;
      this.fileName = null;
      this.dragging = false;
      this.formData = null;
      this.fileSelected = false;
    },
    hideModal() {
      window.location.reload();
    },
    convertToDita() {
      this.progress = 0;
      let folderName = this.fileName.split('.')
      folderName.pop()
      folderName = folderName.join('.')
      const body = {
        userId: localStorage.getItem("userId"),
        orgId: localStorage.getItem("orgId"),
        folderName
      }
      console.log("body", body);
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
      this.$refs["modaloutputprogress2"].show();
      this.$store.getters.client.post("/orguser/wordToDita/convertToDita", body)
        .then(response => {
          setTimeout(() => {
            this.$refs["modaloutputprogress2"].hide();
          }, 2000)
          console.log("convert to dita", response);
          this.foldername = response.data
          this.messageToast(
            "Success",
            "success",
            response.data.message
          );
          setTimeout(() => {
            this.$router.push({ path: `/docmigration/converttodita/outputscreen/${folderName}` });
            this.$refs["modaloutputprogress2"].hide();

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
          this.fileSelected = false;
          this.fileName = null;
        });
    }
  },
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 200px;
}

.drop-zone-inner {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

div.card .card-body .form-group .drop-zone.dragging {
  border: 2px dashed #ccc;
  background-color: #f0f0f0;
}


.drop-zone i {
  color: #ccc;
}

.drop-zone p {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.btn-secondaryBtn {
  background: #252b3b !important;
  color: #fff !important;
}

.card-icons-btn {
  background: #5864d2;
  color: #fff;
}

.card-icons-btn:hover {
  color: #fff;
}

.progress {
  height: 20px;
}

.progress-bar {
  background-color: #007bff;
}
</style>