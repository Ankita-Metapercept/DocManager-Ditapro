<template>
    <div class="custom-modal">
        <div class="modal-content">
            <div ref="ckeditor"></div>
            <!-- <button class="btn btn-info" @click="closeModal">Close</button> -->
        </div>
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
            pElement: ''
        };
    },
    props: {
        tagData: {
            type: Object,
            required: true
        }
    },
    mounted() {
        eventBus.$on('saveTableChanges', this.convertToDita)
        ClassicEditor
            .create(this.$refs.ckeditor, {
                toolbar: {
                    items: ['insertTable', 'TableToolbar', 'undo', 'redo',]
                }
            })
            .then(editor => {
                this.editor = editor;
            })
            .catch(error => {
                console.error('Error initializing CKEditor:', error);
            });
    },
    methods: {
        closeModal() {
            this.$emit("close"); // Emit a custom event to notify the parent component to close the modal
        },
        convertToDita() {
            if (this.editor) {
                const htmlContent = this.editor.getData();
                const pTags = this.extractPTags(htmlContent);
                for (const pTag of pTags) {
                    const pTagXml = this.ptaghtmlToDita(pTag);
                    this.readXML(pTagXml);
                }
                const ditaXml = this.htmlToDita(htmlContent);
                this.readXML(ditaXml);
            }
        },
        extractPTags(htmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");
            const pElements = doc.querySelectorAll('p');

            const pTags = [];
            for (const pElement of pElements) {
                pTags.push(pElement.outerHTML); // Store the outerHTML of each <p> tag
            }

            return pTags;
        },
      
        htmlToDita(htmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");
            console.log("Parsed document:", doc);
            const tableElement = doc.querySelector("table");
            this.pElement = doc.querySelector('p')
            if (tableElement) {
                const ditaXml = this.traverseDOM(tableElement);
                console.log("Converted DITA XML:", ditaXml);
                return ditaXml;
            }
            return "";
        },
        ptaghtmlToDita(htmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");
            const pElement = doc.querySelector('p')
            if (pElement) {
                const ditaXml = this.traverseDOM(pElement);
                return ditaXml;
            }
            return "";
        },
        traverseDOM(node) {
            let ditaXml = "";
            if (node.nodeType === Node.ELEMENT_NODE) {
                const elementName = this.mapElement(node.nodeName);
                const attributes = this.getAttributes(node);
                ditaXml += `<${elementName}${attributes}>`;
                if (elementName === "table") {
                    const numColumns = node.getElementsByTagName("th").length;
                    ditaXml += `<tgroup cols="${numColumns}">`;
                }
                for (const childNode of node.childNodes) {
                    ditaXml += this.traverseDOM(childNode);
                }
                ditaXml += `</${elementName}>`;
                if (elementName === "tbody") {
                    ditaXml += "</tgroup>";
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                ditaXml += node.textContent;
            }
            return ditaXml;
        },
        mapElement(elementName) {
            const lowercaseElementName = elementName.toLowerCase();
            switch (lowercaseElementName) {
                case "th":
                    return "entry";
                case "tbody":
                    return "tbody";
                case "p":
                    return "p"; // Map <p> to <p> in DITA XML
                case "h1":
                    return "title";
                case "ul":
                    return "ul";
                case "li":
                    return "li";
                case "a":
                    return "xref";
                case "img":
                    return "image";
                case "table":
                    return "table";
                case "tr":
                    return "row";
                case "td":
                    return "entry";
                case "thead":
                    return "thead";
                case "strong":
                case "b":
                    return "b";
                case "em":
                case "i":
                    return "i";
                case "code":
                    return "codeph";
                case "pre":
                    return "codeblock";
                case "blockquote":
                    return "note";
                default:
                    return "";
            }
        },
        getAttributes(node) {
            let attributes = '';
            for (const attr of node.attributes) {
                const attributeName = this.mapAttribute(attr.nodeName);
                const attributeValue = attr.nodeValue;
                attributes += ` ${attributeName}="${attributeValue}"`;
            }
            return attributes;
        },
        mapAttribute(attributeName) {
            switch (attributeName) {
                case 'class':
                    return 'outputclass';
                case 'href':
                    return 'href';
                default:
                    return attributeName;
            }
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
            if (items.length > 0) {
                obj[obj.xtag] = items;
            }
            return obj;
        },
        genarateNodeId() {
            const body = {
                nodeDetails: this.xmlObject,
            }
            this.$store.getters.client
                .post(`/orguser/doceditor/generateNodeId`, body)
                .then((res) => {

                    this.tagData[this.tagData.xtag].push(res.data)
                })
                .catch((err) => {
                    console.log("err", err);
                });
        }
    },
};
</script>
