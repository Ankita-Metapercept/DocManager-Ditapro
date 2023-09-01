<template>
    <div style="overflow: scroll">
        <header id="attributeTitle" style="background-color: #021559; padding:4px; border-radius: 0px">File Explorer</header>
        <div v-if="isLoading">
          <div id="preloader">
            <div id="status">
              <div class="spinner">
                <i class="ri-loader-line spin-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <v-jstree :data="treeData"  whole-row @item-click="itemClick"></v-jstree>
    </div>
</template>

<script>
export default {
    data(){
        return {
            treeData: [],
            isLoading: false,
        }
    },
    mounted() {
        this.getFiletree()
    },
    methods:{
        async itemClick (node) {
          console.log(node.model.sha + ' clicked !')
          await this.$store.getters.client
            .get(`orguser/repocontent?repoUser=${this.$route.params.repouser}&repoName=${this.$route.params.reponame}&repoBranch=${this.$route.params.repobranch}&repoPath=${node.model.path}`)
            .then((res) => {
            console.log(res)
                this.$emit('filcontent', res.data)
            })
            .catch((err) => {
            console.log(err);
            });
        },
        getFiletree() {
            this.isLoading = true
            this.$store.getters.client
            .get(`project/githubtree?gitUsername=${this.$route.params.repouser}&gitReponame=${this.$route.params.reponame}&branchsha=${this.$route.params.repobranch}`)
            .then((res) => {
                this.treeData = res.data
                console.log(this.treeData)
                this.isLoading = false
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

