<template>
  <div style="height:100%; background-color:#1E1E1E;" @drop.prevent="loadTextFromFile" @dragover.prevent>
    <!-- Small Table -->

    <v-data-table
      id="small"
      :key="componentKey"
      v-if="$vuetify.breakpoint.xsOnly"
      :headers="headers"
      :items="logs"
      disable-pagination
      no-data-text="No data available. Drag a log file over to view."
      hide-default-footer
      class="elevation-0"
      dark
    ></v-data-table>

    <!-- Large Table -->
    <v-data-table
      id="large"
      :key="componentKey"
      v-if="!$vuetify.breakpoint.xsOnly"
      :headers="headers"
      :items="logs"
      disable-pagination
      no-data-text="No data available. Drag a log file over to view."
      hide-default-footer
      class="elevation-0"
      dark
    >
      <template slot="item" slot-scope="props">
        <tr loading>
          <td v-for="header in headers" :key="header.id">
            <!-- No format -->
            <div v-if="header.dataType !== 'Chip'">
              {{ props.item[header.value] }}
            </div>

            <!-- Chip -->
            <div v-if="header.dataType === 'Chip'">
              <v-chip class="ma-2" :color="props.item.color" outlined>
                {{ props.item[header.value] }}
              </v-chip>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
import LogParser from '../api/LogParser'
//import dinoql from 'dinoql'
export default {

  /***
   * The data function for the view.
   */
  data() {
    return {
      //componentKey: 0,

      // The table headers.
      headers: [],

      // The logs that will be displayed.
      logs: [],

      // Hold the raw data.
      rawData: undefined
    }
  },

  /***
   * Method that is called when the view is created. Load the
   * log data.
   */
  created() {
    this.loadLogData()
  },
  /***
   * The view methods.
   */
  methods: {
    loadTextFromFile(ev) {
      //const file = ev.target.files[0];
      const file = ev.dataTransfer.files[0]
      const reader = new FileReader()

      //reader.onload = e => this.$emit("load", e.target.result);
      var self = this
      reader.onload = function(e) {
        self.rawData = e.target.result
        self.loadLogData()
      }
      reader.readAsText(file)
    },
    /***
     * Filter all items based on a sub set.
     * @all All log items.
     * @sub The subset to filter.
     */
    filter(all, sub) {
      var dict = {}
      for (var i = 0; i < all.length; i++) {
        dict[all[i].id] = all[i]
      }

      var newValues = []
      for (var j = 0; j < sub.length; j++) {
        newValues.push(dict[sub[j].id])
      }
      return newValues
    },

    /***
     * Get log data from a url.
     */
    async getDataFromUrl(url) {
      if (url === undefined) {
        return undefined
      }

      var response = undefined
      try {
        response = await axios({
          url: url,
          method: 'GET'
        })
      } catch (error) {
        // TODO: Add a error popup.
        // eslint-disable-next-line
        console.error(error)
      }
      return response
    },

    /***
     * Load the log data into the view.
     */
    async loadLogData() {
      // Try to load from a url.
      var response = await this.getDataFromUrl(this.url)
      if (response === undefined) {
        if (this.rawData === undefined) {
          return
        }
        response = {
          data: this.rawData
        }
      }

      // Parse the data.
      var parsed = LogParser.parseData(response.data)
      this.headers = parsed.headers

      /*
      var query = dinoql(parsed)`
        items(type: Warn){
          id,
          type,
        }
      `
      this.logs = this.filter(parsed.items, query.items)*/
      this.logs = parsed.items
    },

    forceRerender() {
      this.componentKey += 1;  
    }
  },

  computed: {
    componentKey(){
      return this.$vuetify.breakpoint.name === 'xs' ? 1 : 0;
    }
  },

  // The values passed into the view.
  props: ['url']
}
</script>
