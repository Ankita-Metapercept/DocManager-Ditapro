<template>
    <div>
        <div v-if="typeof errorMessage === 'string'">
            <div class="text-center">
                <div class="d-flex justify-content-center">
                    <div class="position-relative">
                        <img style="height: 250px; margin-bottom: 10px;" src="../../../../assets/placeholder.png"
                            alt="Placeholder Image" />
                        <div style="bottom: 0; left: 0; right: 0; color: #666; font-size: 20px;">
                            {{ errorMessage || "Please select a valid XML file." }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="vscode-container">
            <div class="vscode-card">
                <div class="vscode-card-body">
                    <div ref="editor" class="ace-editor"></div>
                </div>
            </div>
        </div>
    </div>
</template>
  

<script>
import ace from 'brace';
import 'brace/mode/xml';
import xmlFormat from 'xml-formatter';
import { JsonToXml } from "../convert.js";

export default {
    props: {
        errorMessage: {
            type: [Object, String, undefined],
        },
        data: {
            type: [Object, String],
            required: true,
        },
        rootContent: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            formattedXml: '',
            fileContent: '',
            currentfilePath: '',
            themes: [
                'ambiance',
                'chaos',
                'chrome',
                'clouds',
                'cobalt',
                'crimson_editor',
                'dawn',
                'dreamweaver',
                'eclipse',
                'github',
                'gob',
                'gruvbox',
                'monokai',
                'nord_dark',
                'pastel_on_dark',
                'solarized_dark',
                'solarized_light',
                'sqlserver',
                'terminal',
                'textmate',
                'tomorrow',
                'tomorrow_night',
                'tomorrow_night_blue',
            ],
        };
    },
    mounted() {
        this.convertData()
        this.getcontent();
        this.initializeEditor();
    },
    methods: {
        async convertData() {
            let result = this.processJson(this.data);
            let parser = new JsonToXml();
            result = parser.parse(result);
            this.formattedXml = this.rootContent + xmlFormat(result, {
                indentation: '  ',
                filter: (node) => node.type !== 'Comment',
                collapseContent: true,
                lineSeparator: '\n'
            });
        },
        processJson(json) {
            const copyJson = JSON.parse(JSON.stringify(json));
            this.deleteAdditionalFields(copyJson);
            return copyJson;
        },
        deleteAdditionalFields(nodeDetails) {
            if (typeof nodeDetails === "string") return;
            const tagName = nodeDetails.xtag;
            delete nodeDetails.nodeId;
            delete nodeDetails.childFrequency;
            if (nodeDetails.xtagNew) delete nodeDetails.xtagNew;
            if (!nodeDetails[tagName] || !nodeDetails[tagName].length) return;
            for (const childNode of nodeDetails[tagName]) {
                this.deleteAdditionalFields(childNode);
            }
        },
        getcontent() {
            this.fileContent = this.formattedXml;
            this.setValueInEditor();
        },
        initializeEditor() {
            const editor = ace.edit(this.$refs.editor);
            editor.getSession().setMode('ace/mode/xml');
            editor.setShowPrintMargin(false);
            this.changeTheme(this.selectedThemeValue, editor);
            editor.setReadOnly(true);
            // editor.getOption("optionName");
            editor.selection.getCursor();
            this.handleWindowResize(editor);
        },
        setValueInEditor() {
            const editor = ace.edit(this.$refs.editor);
            editor.setValue(this.fileContent, -1);
            this.handleWindowResize(editor);
        },
        changeTheme(selectedTheme, editor) {
            editor.setTheme(`ace/theme/${selectedTheme}`);
        },
        handleWindowResize(editor) {
            editor.resize();
        },
    },
    computed: {
        selectedTheme: {
            get() {
                return this.selectedThemeValue;
            },
            set(newValue) {
                this.$emit('update:selectedThemeValue', newValue);
            },
        },
    },
    watch: {
        selectedThemeValue(newValue) {
            const editor = ace.edit(this.$refs.editor);
            this.changeTheme(newValue, editor);
        },
        data: {
            handler(newValue) {
                this.fileContent = newValue;
                if (!newValue) {
                    console.log(this.data);
                    this.convertData()
                    this.getcontent();
                    this.initializeEditor();
                } else {
                    this.convertData()
                    this.getcontent();
                    this.initializeEditor();
                }
            },
            immediate: true // This ensures the watcher is triggered on component mount
        },
        fileContent(newValue) {
            if (newValue) {
                this.setValueInEditor();
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleWindowResize);
    },
};
</script>

  
<style>
.ace-editor {
    width: 100%;
    height: 100%;
}

.vscode-container {
    height: 75vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vscode-card {
    width: 100%;
    height: 100%;
    /* border: 1px solid #ccc; */
    /* border-radius: 4px; */
}

.vscode-card-body {
    height: 74.6vh;
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    border: 1px solid #dcdcdc;
}
</style>
  