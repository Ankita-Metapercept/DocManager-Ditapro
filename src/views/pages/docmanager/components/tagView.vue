<template>
    <div class="tag-view">
      <div class="tag" v-for="tag in tags" :key="tag.id">  
        {{ tag.name }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TagView",
    props: {
      tags: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .tag-view {
    display: flex;
    flex-wrap: wrap;
  }
  
  .tag {
    background-color: #eee;
    color: #333;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 4px;
    cursor: pointer;
  }
  .inputtext {
  border: rgb(180, 0, 0);
  outline: none;
  /* text-decoration: underline dashed; */
}
  </style>
  