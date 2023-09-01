<template>
    <div>
        <div>
            <PageHeader :title="title" :icon="'fas fa-pencil-ruler'" :items="items" />
            <div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="badge-soft-success mr-2 font-size-15  px-1 ">
                        <span>Project Name :</span>
                        <span class="ml-2">{{ this.projectName }}</span>
                    </div>
                    <div class="badge-soft-info mr-2 font-size-15 px-1 ">
                        <span>DITA-OT Version:</span>
                        <span class="ml-2">{{ this.ditaotVersion }}</span>
                    </div>
                </div>
            </div>
            <b-tabs class="custom-tabs" v-model="activeTab" justified nav-class="nav-tabs-custom"
                content-class="p-3 text-muted">
                <b-tab title="HTML Styler" active>
                    <htmlstyler></htmlstyler>
                </b-tab>
                <b-tab title="PDF Styler">
                    <pdfstyler></pdfstyler>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>
<script>
import { BTabs, BTab } from 'bootstrap-vue'
import htmlstyler from './htmlstyler/index.vue'
import pdfstyler from './pdfstyler/index.vue'
import PageHeader from "@/components/page-header";
import checkurl from '../../../components/urlValidator';
export default {
    components: {
        BTabs,
        BTab,
        htmlstyler,
        pdfstyler,
        PageHeader
    },
    data() {
        return {
            ditaotVersion: '',
            projectName: this.$route.params.reponame,
            activeTab: 0,
            title: "DocStyler",
            items: [
                {
                    text: "Projects",
                    href: `/docmanager`
                },
                {
                    text: "DocEditor",
                    href: `/editor/${this.$route.params.repouser}/${this.$route.params.reponame}/${this.$route.params.repobranch}`
                },
                {
                    text: "DocStyler",
                    active: true
                }
            ],
        }
    },
    mounted() {
        this.getditaotversion();
    },
    created() {
        this.validateURL()
    },
    methods: {
        validateURL() {
            const newRepoUser = this.$route.params.repouser;
            const newRepoName = this.$route.params.reponame;
            const oldRepoUser = localStorage.getItem('repouser');
            const oldRepoName = localStorage.getItem('reponame');
            if (newRepoName !== oldRepoName || newRepoUser !== oldRepoUser) {
                checkurl(newRepoName);
            }
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
    }

}
</script>
  
<style scoped>
.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
    background-color: rgb(153, 177, 255) !important;
    color: #fff !important;
}
</style>