<template>
  <div class="card" style="background-color: #fff;">
    <div class="card-header bg-card">
      <h5 class="card-title text-white d-flex align-items-center mb-0">
        <i class="d-inline-block mdi mdi-note-text cmh-icon"></i> Recent Publication
      </h5>
    </div>
    <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2  "
              :table-props="{ bordered: true, striped: true }"></b-skeleton-table>

    <ul v-else-if="activityData.length > 0 && !showSpinner" data-simplebar class="list-group .card-body mb-3">
      <li class=" list-group-item list-group-item-action m-1" v-for="data in activityData" :key="data.id">
        <div class="d-flex justify-content-between">
          <h5 class="mb-1 font-size-13 ptitle-cust-cls">{{ data.releaseTitle }}</h5>
          <div class="badge-soft-success ml-1 font-size-14">Output format: {{ data.outputFormat }}</div>
        </div>
        <p class="mb-1">
          <b><span class="font-size-14">Released By: {{ data.releasedBy }}</span></b>
        </p>
        <small class="text-muted font-size-14">{{ getTimeAgo(data.createdAt) }}</small>
      </li>
    </ul>
    <div v-else>
      <div colspan="2" class="text-center font-size-14" style="margin-top: 10px;">
        <div style="position: relative; display: inline-block;">
          <img style="height: 200px; margin-bottom: 30px;" src="../../../../assets/placeholder.png" />
          <div
            style="position: absolute; bottom: 0; left: 0; right: 0; color: #666 ; padding-top: 0px; ; font-size: 16px;">
            No Recent Publication Added
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      userId: localStorage.getItem("userId"),
      activityData: [],
      showSpinner: true,
    };
  },
  mounted() {
    this.getReleaseNote();
  },
  methods: {
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
    getReleaseNote() {
      let loader = this.$loading.show({
                loader: "dots",
            });
      this.$store.getters.client
        .get(`/orguser/release/byuserId?userId=${this.userId}`)
        .then((response) => {
          loader.hide();
          this.showSpinner = false;
          this.activityData = response.data.reverse();
        })
        .catch((err) => {
          this.showSpinner = false;
          loader.hide();
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.card {
  height: 45vh;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: #fff;
}

::-webkit-scrollbar-thumb {
  background-color: #bbbbbb;
}

.list-group {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.bg-card {
  background-color: #3F979B;

}
</style>
