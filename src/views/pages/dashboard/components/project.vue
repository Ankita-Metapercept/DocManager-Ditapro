<template>
  <div>
    <div class="card ">
      <div class="card-header bg-card">
        <h5 class="card-title text-white mb-0 d-flex align-items-center"> <i
            class="mdi cmh-icon mdi-text-box-multiple"></i>
          Projects </h5>
      </div>
      <!-- <div class="card-body"> -->
      <div data-simplebar class=" table-responsive table-size">
        <table class="table table-hover font-size-14 mb-0">
          <tbody>
            <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2  "
              :table-props="{ bordered: true, striped: true }"></b-skeleton-table>
            <template v-else-if="projectList && projectList.length > 0 && !showSpinner">
              <tr v-for="item in projectList" :key="item.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="mr-3">
                      <span class="avatar rounded-circle ">
                        <i class="ri-folder-fill ri-lg text-primary"></i>
                      </span>
                    </div>
                    <div>
                      <h5 class="font-size-13 ptitle-cust-cls mb-1">{{ item.projectName }}</h5>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="3" class="text-center font-size-14" style="margin-top: 10px;">
                  <div style="position: relative; display: inline-block;">
                    <img style="height: 200px; margin-bottom: 30px;" src="../../../../assets/placeholder.png" />
                    <div
                      style="position: absolute; bottom: 0; left: 0; right: 0; color: #666 ; padding-top: 0px; ; font-size: 16px;">
                      No Projects added
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!-- </div> -->
      <!-- <div class="text-center mb-1">
        <button class="btn btn-primary btn-sm" v-on:click="redirectProject()">
          <i class="ri-eye-fill mr-2"></i> View More
        </button>
      </div> -->
    </div>

  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    items: Object,
  },
  data() {
    return {
      userId: localStorage.getItem("userId"),
      projectList: null,
      showSpinner: true,
    };
  },
  mounted() {
    this.getProjectData();
  },
  methods: {
    ...mapActions({ get: "userProjectDetails" }),
    async getProjectData() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.get(`/project/byuserid?userId=${this.userId}`)
        .then(() => {
          console.log(this.$store.state.UserProject.suserprojectdata);
          this.projectList = this.$store.state.UserProject.suserprojectdata.map((ele) => {
            return { projectName: ele.projectName };
          });
          this.showSpinner = false;
          loader.hide();
        })
        .catch(() => {
          this.showSpinner = false;
          loader.hide();
        })

    },
    async redirectProject() {
      this.$router.push({ path: `/docmanager` });
      // location.reload();
    },
  },
};
</script>
<style scoped>
.bg-card {
  background-color: #3F979B;
}
.table-size{
  height: 38vh;
}
.card {
  /* height: 50vh; */
  overflow: auto;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #bbbbbb;
}
</style>
