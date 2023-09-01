<template>
  <div>
    <b-card class="p-0 org-card">
      <b-row class="justify-content-between mx-0 header p-3">
        <div class="d-flex align-items-center">
          <span><i class="fas fa-file  mr-1"></i></span>
          <span class="title ml-2">{{ items.projectName }}</span>
        </div>
      </b-row>
      <b-row class="justify-content-between mx-0 px-3 py-2 footer-details">
        <span>
          <span class="badge badge-soft-success mr-2">Total User</span><span>{{ userList.length }}</span>
        </span>
        <span>
          <span class="badge badge-soft-success mr-2">Role</span><span v-for="(role, index) in userRole.userRole"
            :key="role.id">
            <span v-if="userRole.userRole.length - 1 === index">{{ role }}</span>
            <span v-else>{{ role }}, </span>
          </span>
        </span>
      </b-row>
      <!-- <b-row class="justify-content-between mx-0 px-3 py-2 footer-details">
      <span>
        <span class="badge badge-soft-warning mr-2">Last Commit By</span
        ><span>Pending</span>
      </span>
      <span>
        <span class="badge badge-soft-warning mr-2">Last Commit Date</span
        ><span>Pending</span>
      </span>
    </b-row> -->
      <button class="btn btn-success card-btn" type="submit" size="sm"
        v-on:click="setdata(items.owner, items.projectName)">
        Get Details
      </button>

    </b-card>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {

  props: {
    items: Object,
  },
  data() {
    return {
      item: [
        {
          text: "Dashboard",
          href: "/"
        },
        {
          text: "Projects",
          active: true
        }
      ],
      modalShow: false,
      projectList: [],
      userList: [],
      userRole: {},
      projectOwner: null,
      projectName: null
    };
  },
  created() {
    this.userId = localStorage.getItem("userId")
  },
  mounted() {
    this.getUserInProject();
    this.getUserRole()
  },
  methods: {
    async getUserInProject() {
      await this.$store.getters.client
        .get(`/projectuser/byprojectid?projectId=${this.items.id}`)
        .then((response) => {
          this.userList = response.data;

        })
        .catch((err) => {
          console.log(err);
        });
    },
    setdata(owner, projectName) {
      localStorage.setItem("repouser", owner)
      localStorage.setItem('reponame', projectName)
      this.redirectProject(owner, projectName)
    },
    async getUserRole() {
      await this.$store.getters.client
        .get(`/projectuser/byprojectid/byprojectuserid?userId=${this.userId}&projectId=${this.items.id}`)
        .then((response) => {
          // this.userList = response.data;
          // console.log(response.data)
          this.userRole = response.data
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async redirectProject(repouser, reponame) {
      // fetch user data from API
      const repoName = reponame;
      this.$store.getters.client.get(`/project/byuserid?userId=${this.userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => {
          const projectid = res.data.find((item) => item.projectName == repoName).id;
          this.$store.getters.client.get(`/projectuser/byprojectid/byprojectuserid?userId=${this.userId}&projectId=${projectid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then((res) => {
              if (res.data.userRole.includes("DocManager")) {
                this.$router.push({ path: `/docmanager/${repouser}/${reponame}` })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "Sorry, you do not have access to DocManager. Please contact your administrator if you would like to access this feature. Thank you.",
                })
              }
            })
            .catch(() => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Sorry, you do not have access to DocManager. Please contact your administrator if you would like to access this feature. Thank you.",
              })
            });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Sorry, you do not have access to DocManager. Please contact your administrator if you would like to access this feature. Thank you.",
          })
        });
    }
  }
}
</script>

<style lang="scss">
.org-card {
  overflow: hidden;

  .card-body {
    padding: 0;
  }

  .header {
    background: rgba(23, 37, 146, 0.85);
    color: #fff;

    .title {
      font-weight: 700;
      font-size: 15px;
    }
  }

  .details {
    color: #000;
    font-weight: 700;
  }

  .b-dropdown {
    button {
      border: 0;
      padding: 0;
      background: transparent;
      box-shadow: none;

      &:active {
        background: transparent !important;
        box-shadow: none !important;
      }
    }
  }

  .b-dropdown.show {
    button {
      border: 0;
      padding: 0;
      background: transparent;
      box-shadow: none;

      &:active {
        background: transparent !important;
        box-shadow: none !important;
      }
    }
  }

  &.deActive {
    .header {
      background: rgba(23, 37, 146, 0.45);
    }

    .details,
    .footer-details {
      opacity: 0.4;
      background: #f1f1f1;
    }
  }

  &.warningCard {
    .header {
      background-color: rgba(#fcb92c, 1);
    }
  }

  &.dangerCard {
    .header {
      background-color: rgba(#ff3d60, 1);
    }
  }

  .gap-y-3 div {
    margin-bottom: 0.75rem !important;
  }

  .card-btn {
    margin: 10px;
    float: right;
  }
}
</style>