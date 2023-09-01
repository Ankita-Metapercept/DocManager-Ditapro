<script>
import Project from './components/project.vue'
import Role from './components/role.vue'
import RecentNotification from './components/recentnotification.vue'
import RecentPublication from './components/recentpublication.vue'
import PageHeader from "@/components/page-header";

// import Stat from "./widget";

/**
 * Dashboard component
 */
export default {
  components: {
    Project,
    Role,
    RecentNotification,
    RecentPublication,
    PageHeader,
    // Stat,
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Dashboard",
          active: true,
        },
      ],
    };
  },
};
</script>

<template>
  <div>
    <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items" />
    <div class="row">
      <div class="col-xl-6 col-lg-12" style="height: 50vh;">
        <Project />
      </div>
      <div class="col-xl-6 col-lg-12" style="height: 50vh;">
        <Role />
      </div>
    </div>
    <div class="row">
      <div class="col-xl-6 col-lg-12" style="height: 50vh;">
        <RecentNotification />
      </div>
      <div class="col-xl-6 col-lg-12" style="height: 50vh;">
        <RecentPublication />
      </div>
    </div>
  </div>
</template>


