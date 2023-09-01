<template>
  <div class="my-1">
    <li class="no-dots"
      v-if="model.name !== '.git' && model.name !== 'Images' && model.name !== 'out' && model.name !== 'output'">
      <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType" class="d-flex align-items-center">
        <span v-on:click="test(model)" :class="{ highlight: isHighlighted }" @click="selectModel(model)"
          class="d-flex align-items-center path">
          <span class="folder-icon " v-if="isFolder"> {{ isOpen ? "▶" : "▼" }} </span>
          <i class="fas fa-folder icon-cog" v-if="isFolder"></i>
          <i class="fas fa-file-alt icon-cog" v-else></i>
          <span class="truncated-path">{{ model.name }}</span>
        </span>
      </div>
      <ul v-show="isOpen" v-if="isFolder">
        <TreeItem class="item" v-for="childModel in model.children" :key="childModel.id" :model="childModel"></TreeItem>
      </ul>
    </li>
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
    },
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
      let loader = this.$loading.show({
        loader: "dots",
      });
      await this.$store.getters.client
        .get(`/orguser/workspace/filecontent?path=${model.path}`)
        .then((res) => {
          eventBus.$emit('getcontent', { content: res.data, path: model.path });
          // console.log(res.data);
          loader.hide()
          eventBus.$emit('textViewContent', { content: res.data, path: model.path });
          eventBus.$emit('clearHistory')
        })
        .catch((err) => {
          loader.hide()
          console.log(err);
        });
    },
    selectModel(model) {
      eventBus.$emit('highlightModel', model);
    },
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
  color: #1C274C;
}

.highlight {
  color: black;
  font-weight: bold;
  font-family: sans-serif;
  background-color: #d3e3fd;
  padding: 2px 10px;
  border-radius: 20px;
  display: inline-block;
}


.bold {
  font-weight: bold;
}

.item {
  cursor: pointer;
}

.truncated-path {
  overflow: hidden;
  color: #1C274C;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 1px);
  padding-left: 8px;
}


.folder-icon {
  font-size: 11px;
  width: 11px;
  color: #1C274C;
  margin-right: 0.2rem;
  user-select: none;
}

.no-dots {
  list-style: none;
  padding-left: 0;
}
</style>
