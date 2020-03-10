<template>
  <apexchart
    style="foreColor: blue;"
    type="bar"
    height="150"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  data() {
    return {
      
      series: [
        {
          name: 'Error',
          data: [44, 55, 41, 67, 22, 43]
        },
        {
          name: 'Warn',
          data: [13, 23, 20, 8, 13, 27]
        },
        {
          name: 'Info',
          data: [11, 17, 15, 15, 21, 14]
        }
      ],

      chartOptions: {
        colors:["#FF7D7D", "#FFA500", "#90EE90"],
        chart: {
          type: 'bar',
          height: 150,
          foreColor: 'white',
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          type: 'datetime',
          categories: [
            '01/01/2011 GMT',
            '01/02/2011 GMT',
            '01/03/2011 GMT',
            '01/04/2011 GMT',
            '01/05/2011 GMT',
            '01/06/2011 GMT'
          ]
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      }
    }
  },

   /***
   * Components used by the view.
   */
  components: {
    apexchart: VueApexCharts
  },

  /***
   * The data passed to the chart view. 
   */
  props: ['data']
}
</script>
