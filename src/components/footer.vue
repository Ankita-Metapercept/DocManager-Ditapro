<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          {{ currentYear }} © ALL RIGHTS RESERVED BY DITAXPRESSO TECHNOLOGY PRIVATE LIMITED
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default{
  computed:{
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>