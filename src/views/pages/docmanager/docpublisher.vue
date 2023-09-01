<script>
import generateoutput from './components/generateoutput'
import PageHeader from "@/components/page-header";
export default {
  components: {

    generateoutput,
    PageHeader,
  },
  data() {
    return {
      organizationDetails: null,
      orgId: localStorage.getItem('orgId'),
      title: "DocPublisher",
      items: [
        {
          text: "Projects",
          href: `/docmanager`
        },
        {
          text: "DocEditor",
          href: `/doceditor/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.$route.params.repobranch}`
        },
        
        {
          text: "DocPublisher",
          active: true
        }
      ],
    }
  },
  created() {
    this.getOrgDetails()
  },
  methods: {
    async getOrgDetails() {
      console.log("/serveradmin/organization/byorgid")
      await this.$store.getters.client
        .get(`/serveradmin/organization/byorgid?orgId=${this.orgId}`)
        .then((res) => {
          console.log(res)
          this.organizationDetails = res.data[0]
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<template>
  <div>
    <PageHeader :icon="'mdi mdi-cog h2'" :title="title" :items="items" />
    <div>
      <div class="d-flex align-items-center justify-content-between">
        <div class="badge-soft-success mr-2 font-size-15  px-1 ">
          <span>Project Name :</span>
          <span class="ml-2">{{ $route.params.reponame }}</span>
        </div>
        <div class="badge-soft-info mr-2 font-size-15 px-1 ">
          <span>DITA-OT Version:</span>
          <span class="ml-2">{{ organizationDetails.ditaotVersion }}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12" v-if="organizationDetails !== null">
        <generateoutput :ditaotVersion="organizationDetails.ditaotVersion" />
      </div>
    </div>
  </div>
</template>