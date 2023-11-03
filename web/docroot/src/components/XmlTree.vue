<script setup>
const props = defineProps({
  depth: Number,
  element: [Element, Text],
})
function collapse(e) {
  console.log(e)
  // e.children?.forEach(x => x.classList?.add("d-none"))
}
function children(e) {
  let children = []
  let node = e.firstChild
  while (node) {
    children.push(node)
    node = node.nextSibling
  }
  return children
}
</script>

<template>
  <div v-if="props.element.nodeType === 1" :style="'padding-left: ' + (props.depth * 10) + 'px'">
    <span class="d-flex">
        <span
            v-if="props.element.children.length > 0"
            class="bi-dash simulink text-center"
            @click="collapse"
        />
        <span>&lt;{{props.element.nodeName}}</span>
        <span v-if="props.element.hasAttributes()" v-for="attribute in props.element.attributes">
            <span>&nbsp;{{attribute.name}}</span>
            <span>=</span>
            <span>"{{attribute.value}}"</span>
        </span>
        <span v-if="props.element.children.length === 0">&nbsp;/</span>
        <span>></span>
    </span>
    <span v-for="child in children(props.element)">
      <XmlTree v-if="child.nodeType !== 8" :element="child" :depth="props.depth + 1" />
    </span>
    <span
        v-if="props.element.nodeType === 1"
        style="padding-left: -10px"
    >
        <span>&lt;/{{props.element.nodeName}}></span>
    </span>
  </div>
  <span v-if="props.element.nodeType === 3">{{props.element.data.trim()}}</span>
</template>
