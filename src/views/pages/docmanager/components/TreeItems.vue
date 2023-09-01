<template>
  <div>
    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
      <span v-on:click="test(model)" :class="{ highlight: isHighlighted }" @click="selectModel(model)">
        <i class="ri-book-read-fill icon-cog" v-if="isFolder"></i>
        <i class=" ri-file-text-fill icon-cog" v-else></i>
        <span class="truncated-path"> {{ model.name }}</span>
      </span>
      <span v-if="isFolder"> [{{ isOpen ? '-' : '+' }}] </span>
    </div>
    <div v-show="isOpen" v-if="isFolder">
      <TreeItem class="item" v-for="childModel in model.children" :key="childModel.id" :model="childModel">
      </TreeItem>
      <!-- <li class="add" @click="addChild"><i class="fa fa-caret-up"></i></li> -->
    </div>
    <!-- </li> -->
  </div>
</template>
<script>
import { eventBus } from "../../../../main";

export default {
  name: 'TreeItem', // necessary for self-reference
  props: {
    model: Object
  },
  data() {
    return {
      isOpen: false,
      selectedModel: null,
      highlightedModel: null
    }
  },
  computed: {
    isFolder() {
      return this.model.children && this.model.children.length
    },
    isHighlighted() {
      return this.model === this.highlightedModel
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    changeType() {
      if (!this.isFolder) {
        this.model.children = []
        this.addChild()
        this.isOpen = true
      }
    },
    async test(model) {
      console.log(model)
      console.log(model.path)
      await this.$store.getters.client
        .get(`/orguser/workspace/filecontent?path=${model.path}`)
        .then((res) => {
          console.log(res)
          // this.selectedModel = model
          eventBus.$emit('getcontent', { content: res.data, path: model.path });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectModel(model) {

      eventBus.$emit('highlightModel', model);
    },
    addChild() {
      // this.model.children.push({
      //   name: 'new stuff'
      // })
    }
  },
  created() {
    eventBus.$on('highlightModel', (model) => {
      this.highlightedModel = model;
    });
  }
}
</script>

<style scoped>
.icon-cog {
  color: #061873;
}

.highlight {
  color: black;
  background-color: #f0f0f0;
  font-weight: bolder
}

.bold {
  font-weight: bold;
}

.item {
  cursor: pointer;
}

.truncated-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 10px;
  /* Adjust this value to limit the display width */
}</style>
