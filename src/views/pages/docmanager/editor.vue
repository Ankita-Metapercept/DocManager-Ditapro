<template>
  <div class="border-top border-bottom border-left border-right rounded-md">
    <div v-if="editor" class="py-2 px-3 border-bottom">
      <b-button-group class="mr-3">
        <b-button variant="light" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          H1
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          H2
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          H3
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }">
          P
        </b-button>
      </b-button-group>
      <b-button-group class="mr-3">
        <b-button variant="light" @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          <i class="ri-bold"></i>
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          <i class="ri-italic"></i>
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          <i class="ri-strikethrough-2"></i>
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().toggleHighlight().run()"
          :class="{ 'is-active': editor.isActive('highlight') }">
          <i class="ri-edit-2-line"></i>
        </b-button>
      </b-button-group>
      <b-button-group class="mt-4 mt-md-0">
        <b-button variant="light" @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
          <i class="ri-menu-2-line"></i>
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
          <i class="ri-menu-5-line"></i>
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
          <i class="ri-menu-3-line"></i>
        </b-button>
        <b-button variant="light" @click="editor.chain().focus().setTextAlign('justify').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
          <i class="ri-menu-line"></i>
        </b-button>
      </b-button-group>
    </div>
    <editor-content :editor="editor" class="p-3" />
  </div>
</template>

<script>
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-2";

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    };
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight,
      ],
      content: `
        <?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<!--  This file is part of the DITA Open Toolkit project. See the accompanying LICENSE file for applicable license.  -->
<!-- (c) Copyright IBM Corp. 2004, 2005 All Rights Reserved. -->
<topic id="configuring" xml:lang="en-us">
  <title>Configuring</title>
  <shortdesc>You configure components to set up or refine your solution.</shortdesc>
  <body>
    <p>You don't have to get the best configuration the first time. Instead, you might start with a simple configuration
      and then refine it gradually as needed. </p>
  </body>
</topic>

      `,
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  margin-top: 1rem;

  >*+* {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #faf594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}
</style>