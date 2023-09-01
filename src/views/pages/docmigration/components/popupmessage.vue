<template>
  <div>
    <b-modal ref="my-modal" hide-footer title="important message" hide-close no-close-on-backdrop no-close-on-esc>
      <div class="d-block text-center">
        <h6>
          "I'm sorry, but it seems like you don't have the necessary permission
          to access DocMigration at the moment. If you wish to access
          DocMigration, you'll need to contact the administrator in charge of
          granting access to DocMigration.
        </h6>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal"
        >Close Me</b-button
      >
    </b-modal>
  </div>
</template>

<script>
export default {
  methods: {
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
      this.$router.push({ name: "Dashboard" });
    },

  },
  mounted() {
    this.showModal();
  },
};
</script>
<style>
.modal-header .close {
  display: none;
}
</style>