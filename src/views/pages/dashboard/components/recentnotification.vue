<template>
  <div>
    <div class="card">
      <div class="media">
        <div class=" media-body overflow-hidden card-header bg-card">
          <h5 class="card-title text-white d-flex align-items-center mb-0">
            <i class="d-inline-block mdi mdi-bell cmh-icon"></i> Recent Notifications
          </h5>
        </div>
      </div>
      <div data-simplebar class="card-body border-top py-3 card-body">
        <div style="height: 40vh;">
          <ul class="list-unstyled activity-wid">
            <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2  "
              :table-props="{ bordered: true, striped: true }"></b-skeleton-table>
            <div v-else-if="notificationData.length > 0 && !showSpinner">
              <li class="activity-list publication-list-cust-cls" v-for="data in notificationData" :key="data.id">
                <div class="d-flex justify-content-between">
                  <div class="activity-icon avatar-xs">
                    <span
                      class="avatar-title bg-soft-primary text-primary rounded-circle font-size-24 avatar-title-cust-cls">
                      <i class="ri-price-tag-3-fill"></i>
                    </span>
                  </div>
                  <div>
                    <div>
                      <h5 class="font-size-13 ptitle-cust-cls">
                        {{ data.projectName }}
                      </h5>
                    </div>
                    <div>
                      <p class="text-muted mb-0">{{ data.message }}</p>
                    </div>
                  </div>
                  <div>
                    <p class="text-muted  mb-0 mr-5" style="font-size: smaller;">{{
                      getTimeAgo(data.committer.date) }}</p>
                  </div>
                </div>
              </li>
            </div>
            <li v-else>
              <div class="d-flex justify-content-center align-items-center m-0 p-0">
                <div class="text-center">
                  <img style="height: 200px;" src="../../../../assets/placeholder.png" />
                  <div style=" color: #666; font-size: 16px;">
                    No commits added in the last 24 hours
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
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
      showSpinner: true,
      userId: localStorage.getItem("userId"),
      orgId: localStorage.getItem("orgId"),
      notificationData: [],
      userProjects: null
    };
  },
  mounted() {
    this.getrecentnotification()

  },
  methods: {
    ...mapActions({ get: "userProjectDetails" }),
    getTimeAgo(timestamp) {
      const now = new Date();
      const timeDiff = now.getTime() - new Date(timestamp).getTime();
      const minuteDiff = Math.floor(timeDiff / 60000); // 60000 milliseconds in a minute

      if (minuteDiff < 1) {
        return 'just now';
      } else if (minuteDiff < 60) {
        return `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} ago`;
      } else {
        const hourDiff = Math.floor(minuteDiff / 60);
        if (hourDiff < 24) {
          return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
        } else {
          const dayDiff = Math.floor(hourDiff / 24);
          if (dayDiff < 30) {
            return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
          } else {
            const monthDiff = Math.floor(dayDiff / 30);
            if (monthDiff < 12) {
              return `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`;
            } else {
              const yearDiff = Math.floor(monthDiff / 12);
              return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
            }
          }
        }
      }
    },
    getrecentnotification() {
      let loader = this.$loading.show({
                loader: "dots",
            });
      this.$store.getters.client
        .get(`/orguser/repo/24hrsCommitNotifications?userId=${this.userId}`)
        .then((response) => {
          this.showSpinner = false;
          this.notificationData = response.data;
          loader.hide();
        })
        .catch((err) => {
          this.showSpinner = false;
          console.log("notification err", err);
          loader.hide();
        });
    },


  }
};
</script>
<style scoped>
.card {
  height: 45vh;

}



.badge {
  width: 100px;
}

thead {
  background-color: #f2f2f2;
  /* Set the desired background color */
}

th {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  /* Add a bottom border to separate the header from the content */
  font-size: 15px;
  /* Adjust the font size to your preference */
  font-weight: bold;
  /* Make the font bold */
}

.bg-card {
  background-color: #3F979B;
}
</style>
