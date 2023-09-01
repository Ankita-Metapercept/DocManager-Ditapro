<template>
  <div>
    <div ref="ckeditor"></div>
  </div>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { eventBus } from "../../../../main";
export default {
  data() {
    return {
      editor: null,
      ckeditorContent: '',
      textData:''
    };
  },
  props: {
    tagData: {
      type: Object,
      required: true
    },
  },
  mounted() {
    ClassicEditor
      .create(this.$refs.ckeditor, {
        toolbar: {
          items: ['bulletedList', 'undo', 'redo']
        }
      })
      .then(editor => {
        this.editor = editor;
        if (typeof this.textData === 'string') {
          console.log("typeof this.textData", this.textData);
          this.editor.setData(this.textData);
        } else {
          console.log("else this.textData", this.textData);
          this.textData = '';
          this.editor.setData(this.textData);
        }
      })
      .catch(error => {
        console.error('Error initializing CKEditor:', error);
      });
    eventBus.$on('saveUlChanges', this.convertToDita);
  },



  methods: {
    convertToDita() {
      const xml = `<title>${this.editor.getData().replace(/&nbsp;/g, '')}</title>`;
      //  xml = xml.replace(/&nbsp;/g, '');
      console.log("xml ouput", xml);
      this.readXML(xml);
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
          console.log("this.tagData[this.tagData.xtag]",this.tagData[this.tagData.xtag],"this.tagData",this.tagData );
          this.tagData[this.tagData.xtag] = [...this.tagData[this.tagData.xtag], ...res.data.title]
        })
        .catch((err) => {
          console.log("err", err);
        });
    }

  }
};
</script>
