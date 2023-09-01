<template>
  <div>
    <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items" />
    <div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="badge-soft-info mr-2 font-size-15 px-1 ">
          <span>DITA-OT Version:</span>
          <span class="ml-2">{{ this.ditaotVersion }}</span>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card-header bg-primary text-white">
          <h5 class="card-title  text-white d-flex align-items-center  mb-0">
            <i class="ri-folder-4-fill ri-lg mr-1"></i> Output Screen
          </h5>
        </div>
        <div class="card shadow-sm">
          <div class="card-body">
            <form>
              <h5 class=" mb-4">Source word file: <span class="text-muted text-sm">{{ selectedfolder }}</span></h5>
              <h6 class="flex-grow-1">Download output DITA folder</h6>
              <div class="d-flex pt-1">
                <button type="submit" class="btn btn-primary  btn-md mr-2 btn-block mb-2 m-0"
                  @click.prevent="downloadZip">
                  <i class="fa fa-fw fa-file-zipper me-2"></i> Download as ZIP
                </button>
                <button type="submit" class="btn btn-success btn-md  btn-block mb-2  m-0" @click="gitHubCommit">
                  <i class="fab fa-github me-2"></i> Commit on GitHub
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageHeader from "@/components/page-header";
export default {
  components: {
    PageHeader
  },
  data() {
    return {
      userId: localStorage.getItem("userId"),
      orgId: localStorage.getItem("orgId"),
      ditaotVersion: '',
      selectedfolder: this.$route.params.selectedfolder,
      title: "DocMigration",
      items: [
        {
          text: "Dashboard",
          href: "/"
        },
        {
          text: "DocMigration",
          active: true
        }
      ],

    };
  },
  mounted(){
    this.getditaotversion()
  },
  methods: {
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    async getditaotversion() {
      this.getOrgId = window.localStorage.getItem('orgId')
      console.log(this.getOrgId)
      await this.$store.getters.client
        .get(`/serveradmin/organization/byorgid?orgId=${this.getOrgId}`)
        .then((response) => {
          console.log(response.data[0].ditaotVersion);
          this.ditaotVersion = response.data[0].ditaotVersion
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async downloadZip() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      await this.$store.getters.client.get(`/orguser/wordToDita/downloadDitazip?orgId=${this.orgId}&userId=${this.userId}&folderName=${this.$route.params.selectedfolder}`,
        {
          responseType: "blob",
        }
      )
        .then((response) => {
          console.log(response, "response");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${this.$route.params.selectedfolder}.zip`);
          document.body.appendChild(link);
          link.click();
          loader.hide()
          this.messageToast(
            "Success",
            "success",
            "Zip file has been downloaded successfully"
          )
        })
        .catch((error) => {
          console.log(error)
          loader.hide()
          this.messageToast(
            "Invalid request",
            "danger",
            error.message
          );
          loader.hide();
        });
    },
    gitHubCommit() {
      this.$router.push({ path: `/docmigration/converttodita/outputscreen/githubcommit/${this.selectedfolder}` })
    }
  }

}
</script>

  
<style scoped>
.btn-primary {
  background: #2b313f !important;
  color: #fff !important;
  transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #4c5aa7 !important;
}
</style>
  