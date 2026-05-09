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
  <div class="mb-4 w-full" style="font-family: 'Poppins', sans-serif;">
    <label v-if="label" class="block text-[13px] font-medium text-gray-700 mb-2 uppercase tracking-wide">
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#82ae46] focus:ring-1 focus:ring-[#82ae46] rounded-md"
      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': error }"
    />
    <p v-if="error" class="mt-1 text-xs text-red-500 italic">{{ error }}</p>
  </div>
</template>