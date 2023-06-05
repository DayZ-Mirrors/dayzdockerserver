<template>
  <div
      v-if="elem.nodeType === 1 && isText"
      :style="'padding-left: ' + (depth * 10) + 'px'"
      @click="collapse"
  >
    <span class="xml-tree-tag">&lt;{{elem.nodeName}}</span>
    <span v-if="elem.hasAttributes()" v-for="attribute in elem.attributes">
        <span class="xml-tree-attr">&nbsp;{{attribute.name}}</span>
        <span>=</span>
        <span class="xml-tree-attr">"{{attribute.value}}"</span>
    </span>
    <span class="xml-tree-tag">></span>
    <span>{{this.children[0].data.trim()}}</span>
    <span class="xml-tree-tag">&lt;/{{elem.nodeName}}></span>
  </div>
  <div v-else :style="'padding-left: ' + (depth * 10) + 'px'">
    <span v-if="elem.nodeType === 1" class="d-flex">
        <span
            v-if="elem.children.length > 0"
            class="bi-dash simulink text-center"
            @click="collapse"
        />
        <span v-else></span>
        <span class="xml-tree-tag">&lt;{{elem.nodeName}}</span>
        <span v-if="elem.hasAttributes()" v-for="attribute in elem.attributes">
            <span class="xml-tree-attr">&nbsp;{{attribute.name}}</span>
            <span>=</span>
            <span class="xml-tree-attr">"{{attribute.value}}"</span>
        </span>
        <span v-if="elem.children.length === 0" class="xml-tree-tag">&nbsp;/></span>
        <span v-else class="xml-tree-tag">></span>
    </span>
    <span v-if="elem.nodeType === 3">{{elem.data.trim()}}</span>
    <div v-for="child in children">
      <xmltree v-if="child.nodeType !== 8" :element="child" :d="depth" />
    </div>
    <span
        v-if="elem.nodeType === 1 && elem.children.length > 0"
        style="padding-left: -10px"
    >
        <span style="padding-left: 20px" class="xml-tree-tag">&lt;/{{elem.nodeName}}></span>
    </span>
  </div>
</template>

<script>
export default {
  name: "xmltree",
  props: {
    d: {
      type: Number,
      default: 0
    },
    element: {
      type: [Element, Text],
      default: undefined
    },
    xmlData: String
  },
  data() {
    return {
      depth: 1
    }
  },
  methods: {
    collapse() {
      this.children.forEach(x => x.classList?.add("d-none"))
    },
    log(message) {
      console.log(message)
    }
  },
  computed: {
    elem() {
      this.depth = parseInt(this.d) + 1
      if (this.element) {
        return this.element
      } else {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(this.xmlData, "text/xml")
        return xmlDoc.documentElement
      }
    },
    children() {
      let children = []
      let node = this.elem.firstChild
      while (node) {
        children.push(node)
        node = node.nextSibling
      }
      return children
    },
    isText() {
      if (this.children.length === 1) {
        if (this.children[0].nodeType === 3) {
          return true
        }
      }
      return false
    }
  }
}
</script>
