<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";
// import PageHeader from "@/components/page-header";
import Horizontal from "./horizontal";

export default {
  components: { Vertical, Horizontal,  },
  data() {
    return {
      title: "",
      items: [],
      show: false,
    };
  },
  computed: {
    ...layoutComputed,
  },
  methods: {
    verifyToken() {
      const token = this.$store.state.Auth.token;
      if (!token) {
        this.$router.push({ name: "Login" });
      }
    },
    
  },
  mounted() {
    this.verifyToken();
  },
  
};
</script>

<template>
  <div>
    <vertical v-if="layoutType === 'vertical'" :layout="layoutType">
      <slot />
      <router-view />
    </vertical>
    <Horizontal v-if="layoutType === 'horizontal'" :layout="layoutType">
      <slot />
    </Horizontal>
  </div>
</template>
