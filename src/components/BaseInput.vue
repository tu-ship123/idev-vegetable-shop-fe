<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mb-4 w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-100"
      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': error }"
      v-bind="$attrs"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script>
// Tắt kế thừa attributes mặc định để gán thẳng vào thẻ input thông qua v-bind="$attrs"
export default { inheritAttrs: false }
</script>