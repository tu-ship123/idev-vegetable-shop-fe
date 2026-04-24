<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
    // Ví dụ: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Tên SP' }]
  },
  data: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500">
            Không có dữ liệu
          </td>
        </tr>
        <tr v-else v-for="(row, index) in data" :key="index" class="hover:bg-gray-50 transition">
          <td
            v-for="col in columns"
            :key="col.key"
            class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
          >
            <slot :name="`cell-${col.key}`" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>