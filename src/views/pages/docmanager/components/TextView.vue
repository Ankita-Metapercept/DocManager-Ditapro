<template>
  <div class="code-container">
    <pre class="language-xml"><code v-html="formattedXml"></code></pre>
    <button @click="formatXml">Show Data in Console</button>
  </div>
</template>

<script>
import { JsonToXml } from '../convert.js'
import Prism from 'prismjs'
import xmlFormatter from 'xml-formatter';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  
  data() {
    return {
      formattedXml: '',
    };
  },
  mounted() {
    Prism.highlightAll();
  },
  methods: {
    formatXml() {
      const result = this.processJson(this.data);
      const parser = new JsonToXml();
      const xml = parser.parse(result);
      this.formattedXml = xmlFormatter(xml, { indentation: '  ' });
      console.log("formattedXml", this.formattedXml);
    },
    processJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
  },
  created() {
    console.log("tag view data", this.data);
  },
};
</script>


  
<style scoped>
/* .code-container {
  background-color: #1e1e1e;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}

.xml-code {
  color: #f8f8f2;
  font-family: monospace;
  font-size: 14px;
} */
</style>
  