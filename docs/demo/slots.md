---
layout: demo
---

## Slots Demo

This page demonstrates slotted content. [See the data used](./slots.js).

{% raw  %}
<div id="app">
    <tree id="customtree" :model="model">
        <template v-slot:text="{ model, customClasses }">
            <span>{{ model.label }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
        </template>
        <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
            <label :for="inputId" :title="model.title">
                <input :id="inputId"
                       type="checkbox"
                       :disabled="model.state.input.disabled"
                       v-model="model.state.input.value"
                       @change="checkboxChangeHandler">
                <marquee style="max-width: 6rem">{{ model.label }}. Custom Classes: {{ JSON.stringify(customClasses) }}</marquee>
            </label>
        </template>
        <template v-slot:radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
            <label :for="inputId" :title="model.title">
                <input :id="inputId"
                       type="radio"
                       :name="model.input.name"
                       :value="model.input.value"
                       :disabled="model.state.input.disabled"
                       v-model="inputModel"
                       @change="radioChangeHandler">
                <span style="font-weight: bolder">{{ model.label }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
            </label>
        </template>
    </tree>
</div>
{% endraw  %}

<script type='module'>
    import slotsData from './slots.js';

    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: slotsData
        };
      }
    }).$mount('#app')
</script>