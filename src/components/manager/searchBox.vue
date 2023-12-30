<template>
  <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="Please input"
      @select="handleSelect"
  />
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const state = ref('');

    const links = ref([]);

    const loadAll = () => {
      return [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        // ... other items
      ];
    };

    let timeout;
    const querySearchAsync = (queryString, cb) => {
      const results = queryString
          ? links.value.filter(createFilter(queryString))
          : links.value;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    };

    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    };

    const handleSelect = (item) => {
      console.log(item);
    };

    onMounted(() => {
      links.value = loadAll();
    });

    return {
      state,
      querySearchAsync,
      handleSelect,
    };
  },
};
</script>
