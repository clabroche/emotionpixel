<template>
  <apexchart width="500" type="pie" :options="options" :series="series"></apexchart>
</template>

<script>
import { computed } from 'vue';
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts
  },
  props: {
    series: {default: [], required: true},
    labels: {default: [], required: true},
  },
  setup(props) {
    return {
      options: computed(() => ({
        chart: {
          type: 'pie',
        },
        labels: props.labels
      }))
    }
  }
}
</script>
