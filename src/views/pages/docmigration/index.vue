<template>
  <div>
    <PageHeader :icon="'mdi mdi-file-replace h2'" :title="title" :items="items" />
    <div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="badge-soft-info mr-2 font-size-15 px-1 ">
          <span>DITA-OT Version:</span>
          <span class="ml-2">{{ this.ditaotVersion }}</span>
        </div>
      </div>
    </div>
    <div class="container">

      <div class="row ">
        <div class="col-md-6 offset-md-3">
          <Details />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Details from "./components/details.vue";
import PageHeader from "@/components/page-header";
export default {
  components: {
    Details,
    PageHeader,
  },
  data() {
    return {
      ditaotVersion: '',
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
  mounted() {
    this.getditaotversion();
  },
  methods: {
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
  }
};
</script>
