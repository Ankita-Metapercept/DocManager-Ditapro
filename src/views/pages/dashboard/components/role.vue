<template>
  <div>
    <div class="card">
      <div class="card-header bg-card">
        <h5 class="card-title text-white mb-0 d-flex align-items-center">
          <i class="mdi mdi-account-multiple cmh-icon"></i> Roles
        </h5>
      </div>
      <div class="table-responsive data-simplebar table-size">
        <table class="table font-size-14 table-hover m mb-0 table-centered table-nowrap">
          <thead>
            <tr>
              <th>
                <div class="font-weight-bold font-size-16" >Project</div>
              </th>
              <th>
                <div class="font-weight-bold font-size-16" >Role</div>
              </th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="(projectId, index) in this.$store.state.UserProject.suserprojectdata" :key="projectId">
              <td>
                <h5 class="font-size-13 ptitle-cust-cls mb-0">{{ projectList[index] }}</h5>
              </td>
              <td>
                <span v-if="userRole[index].userRole">
                  <span v-for="role in userRole[index].userRole" :key="role.id">
                    {{ role }} |
                  </span>
                </span>
              </td>
            </tr>
            <tr v-if="this.$store.state.UserProject.suserprojectdata.length === 0">
              <td colspan="2" class="text-center font-size-14" style="margin-top: 10px;">
                <div style="position: relative; display: inline-block;">
                  <img style="height: 200px; margin-bottom: 30px;" src="../../../../assets/placeholder.png" />
                  <div
                    style="position: absolute; bottom: 0; left: 0; right: 0; color: #666; padding-top: 0px; font-size: 16px;">
                    No Projects added
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      modalShow: false,
      projectList: [],
      userList: [],
      projectIdList: [],
      userRole: [],
      userId: null // add this line to define the userId property
    };
  },

  mounted() {
    this.userId = localStorage.getItem("userId");
    this.getProjects();
  },

  methods: {
    ...mapActions({ get: "userProjectDetails" }),
    async getProjects() {
      try {
        await this.get(`/project/byuserid?userId=${this.userId}`);
        const userProjects = this.$store.state.UserProject.suserprojectdata;
        this.projectList = userProjects.map((item) => item.projectName);
        this.projectIdList = userProjects.map((item) => item.id);
        // Initialize the userRole array with an empty array for each project
        this.userRole = this.projectIdList.map(() => []);
        await Promise.all(
          this.projectIdList.map(async (projectId, index) => {
            await this.getUserRole(projectId, index);
          })
        );
      } catch (err) {
        console.log(err);
      }
    },

    async getUserRole(projectId, index) {
      try {
        const response = await this.$store.getters.client.get(
          `/projectuser/byprojectid/byprojectuserid?userId=${this.userId}&projectId=${projectId}`
        );
        this.$set(this.userRole, index, response.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};

</script>
<style scoped>
.card-body {
  /* height: 40vh; */
  overflow: auto;
  /* enable scrolling */
}

.cmh-title {
  color: #021559;
  font-size: 20px;
  vertical-align: text-bottom;
  padding-left: 10px;
  font-weight: 600;
  margin-bottom: 0px;
}

.table-size {
  height: 38vh;
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

.bg-card {
  background-color: #3F979B;
}

thead {
    background-color: #f2f2f2; /* Set the desired background color */
  }
  
  th {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd; /* Add a bottom border to separate the header from the content */
    font-size: 18px; /* Adjust the font size to your preference */
    font-weight: bold; /* Make the font bold */
  }
</style>
