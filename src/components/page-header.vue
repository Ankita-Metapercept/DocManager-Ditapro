<script>

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => {
        return [
        ]
      },
    },
  },
}
</script>

<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div class="page-title-box d-flex align-items-center justify-content-between">
        <div class="media  ">
          <div class=" d-flex align-items-center">
            <div class="mr-1">
              <i :class="[icon, 'avatar-xs']"></i>
            </div>
            <div class="mt-2">
              <h5>{{ title }}</h5>
            </div>
          </div>
        </div>
        <h5 class="mb-0"><span><i></i></span></h5>
        <div class="page-title-right">
          <b-breadcrumb :items="items" class="m-0"></b-breadcrumb>
        </div>
      </div>
    </div>
  </div>

  <!-- end page title -->
</template>
