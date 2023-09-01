<template>
  <div>
    <!-- Your existing CKEditor component -->
    <ckeditor v-model="value" :editor="editor" :config="editorConfig"></ckeditor>

    <!-- Button to convert HTML to XML -->
    <button @click="convertToXML">Convert to XML</button>
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  components: { ckeditor: CKEditor.component },
  data() {
    return {
      value: "",
      editor: ClassicEditor,
      editorConfig: {
        toolbar: ["insertTable"],
        table: {
          contentToolbar: ["tableColumn", "tableRow", "tableProperties", "tableCellProperties"],
          tableProperties: {
            headers: {
              content: "tableHeader"
            }
          }
        }
      }
    };
  },
  methods: {
    convertToXML() {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = this.value;

      const tableElement = tempElement.querySelector("figure.table > table");
      if (!tableElement) {
        console.error("No table found in HTML");
        return;
      }

      const xml = document.createElement("table");
      const tgroup = document.createElement("tgroup");
      tgroup.setAttribute("cols", tableElement.rows[0].cells.length);

      const tbody = document.createElement("tbody");

      for (let i = 0; i < tableElement.rows.length; i++) {
        const rowElement = tableElement.rows[i];
        const row = document.createElement("row");

        for (let j = 0; j < rowElement.cells.length; j++) {
          const cellElement = rowElement.cells[j];
          const entry = document.createElement("entry");
          entry.textContent = cellElement.textContent;
          row.appendChild(entry);
        }

        tbody.appendChild(row);
      }

      tgroup.appendChild(tbody);
      xml.appendChild(tgroup);

      const serializer = new XMLSerializer();
      const xmlString = serializer.serializeToString(xml);

      console.log("XML STRING ", xmlString);
      this.readXML(xmlString)
    },
    readXML(xml) {
      let fileContentObjn = xml;
      let that = this;
      let domParser = new DOMParser();
      let xmlDom = domParser.parseFromString(
        fileContentObjn,
        "application/xml"
      );
      that.preProcess(xmlDom);
      that.xmlObject = null;
      that.xmlObject = that.xmlDomToJson(xmlDom.childNodes[0]);
      this.genarateNodeId();
      if (that.xmlObject.html && that.xmlObject.text) {
        return;
      }
    },
    preProcess(xml) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const node = xml.childNodes[i];
        if (node.nodeType !== 1) {
          xml.removeChild(node);
          i--;
        } else if (node.nodeName.toLowerCase() === 'ul' || node.nodeName.toLowerCase() === 'ol') {
          this.preProcess(node);
        }
      }
    },
    xmlDomToJson(xml) {
      if (xml.nodeType !== 1) {
        return null;
      }
      let obj = {};
      obj.xtag = xml.nodeName;
      // Proess the text content if present
      // let nodeText = (xml.textContent || "").replace(/(\r|\n)/g, "").trim();
      // if (nodeText) {
      //   obj.text = nodeText;
      // }
      // Convert the XML element's attributes
      if (xml.attributes.length > 0) {
        for (let i = 0; i < xml.attributes.length; i++) {
          let attribute = xml.attributes[i];
          obj[attribute.nodeName] = attribute.nodeValue;
        }
      }
      // Convert the XML element's childNodes
      let items = [];
      for (let i = 0; i < xml.childNodes.length; i++) {
        let node = xml.childNodes[i];
        if (node.nodeType === 1) {
          let item = this.xmlDomToJson(node); // Call recursion to convert childNodes
          if (item) {
            items.push(item);
          }
        } else if (node.nodeType === 3) {
          let text = (node.textContent || "").replace(/(\r|\n)/g, "").trim();
          if (text) {
            items.push(text);
          }
        }
      }
      // Assign the childNodes array to the object
      if (items.length > 0) {
        obj[obj.xtag] = items;
      }
      return obj;
    },
    genarateNodeId() {
      const body = {
        nodeDetails: this.xmlObject,
      }
      console.log(body);
      this.$store.getters.client
        .post(`/orguser/doceditor/generateNodeId`, body)
        .then((res) => {
          console.log("res", res.data);
          this.tagData[this.tagData.xtag].splice(this.self, 1, ...res.data.title)
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  },
  watch: {
    value(newValue) {
      console.log("Editor output:", newValue);
    }
  }
};
</script>
