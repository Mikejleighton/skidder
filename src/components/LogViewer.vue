<template>
  <div
    style="height:100%; background-color:#1E1E1E;"
    @drop.prevent="loadTextFromFile"
    @dragover.prevent
  >
    <!-- Display an alert for a filter -->
    <v-alert
      v-if="filterMessage !== undefined"
      type="info"
      style="z-index:10; margin: 10px 0 0 0;"
      class="elevation-5"
      tile
      dense
    >
      {{ filterMessage }}
    </v-alert>
    <div v-if="filterMessage === undefined" style="padding:5px;"></div>

    <!-- Main row -->
    <v-row style="height:100%; background-color:#1E1E1E;">
      <!-- No data -->
      <v-col
        v-if="!logLoaded"
        style="height:100%; color:white; background-color:#1E1E1E;"
      >
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-card class="elevation-0" dark>
                  <v-row align="center" justify="center">
                    <h2 class="display-1 font-weight-light">
                      No Data Available
                    </h2>
                  </v-row>

                  <v-row
                    style="margin-top:30px;"
                    align="center"
                    justify="center"
                  >
                    <v-divider
                      style="max-width:150px; background-color:white;"
                    ></v-divider>
                  </v-row>

                  <v-row
                    style="max-width:400px; margin-top:30px; padding-right:30px; padding-left:30px;"
                    justify="center"
                  >
                    <p style="text-align:center;">
                      Drag and drop a log file to view its contents. If you are
                      just getting started then try out a sample log file.
                    </p>
                  </v-row>

                  <v-row style="margin-top:30px;" justify="center">
                    <v-btn outlined @click="loadSample()">Sample</v-btn>
                  </v-row>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <!-- Main content -->
      <v-col
        v-if="logLoaded && splitScreen"
        style="height:100%; padding-top:0px; padding-right:0px;"
      >
        <v-toolbar dark class="elevation-0" color="#1E1E1E" dense>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" text @click="displayView('search')">
            <v-icon left>mdi-magnify</v-icon> Search
          </v-btn>
          <v-btn class="ma-2" text @click="displayView('settings')">
            <v-icon left>mdi-settings</v-icon> Settings
          </v-btn>
        </v-toolbar>

        <!-- Small Table -->
        <v-data-table
          id="small"
          :key="componentKey"
          v-if="$vuetify.breakpoint.xsOnly"
          :headers="displayHeaders"
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
          dense
          :key="componentKey"
          v-if="!$vuetify.breakpoint.xsOnly"
          :headers="displayHeaders"
          :items="logs"
          disable-pagination
          no-data-text="No data available. Drag a log file over to view."
          hide-default-footer
          class="elevation-0"
          dark
        >
          <template slot="item" slot-scope="props">
            <tr loading>
              <td v-for="header in displayHeaders" :key="header.id">
                <!-- No format -->
                <div v-if="header.dataType !== 'Chip'">
                  {{ props.item[header.value] }}
                </div>

                <!-- Chip -->
                <div v-if="header.dataType === 'Chip'">
                  <v-chip class="ma-2" :color="props.item.color" x-small>
                    {{ props.item[header.value] }}
                  </v-chip>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>

      <!-- The settings view -->
      <v-col
        v-if="displaySettings"
        v-bind:class="[
          { smallWindow: splitScreen },
          { largeWindow: !splitScreen }
        ]"
      >
        <settings-view
          v-on:onClose="displayView(undefined)"
          v-on:onHeaderChanged="onHeaderChanged"
          v-bind:displayedHeaders="displayHeaders"
          v-bind:headers="headers"
        ></settings-view>
      </v-col>

      <!-- The search view -->
      <v-col
        v-if="displaySearch"
        v-bind:class="[
          { smallWindow: splitScreen },
          { largeWindow: !splitScreen }
        ]"
      >
        <search-view
          v-on:onClose="displayView(undefined)"
          v-on:onLogsFiltered="onLogsFiltered"
          v-bind:logs="allLogs"
          v-bind:search="searchTerm"
        ></search-view>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.smallWindow {
  max-width: 400px;
  height: 100%;
  padding: 0px;
}
.largeWindow {
  width: 100px;
  height: 100%;
  padding: 0px;
}
</style>

<script>
import axios from 'axios'
import LogParser from '../api/LogParser'
import SettingsView from './SettingsView.vue'
import SearchView from './SearchView.vue'
export default {
  /***
   * The data function for the view.
   */
  data() {
    return {
      // The url to load a log file from.
      loadUrl: undefined,

      // Hold if a log has been loaded.
      logLoaded: false,

      // Hold if we should display the settings panel.
      displaySettings: false,

      // Hold if we should display the search panel.
      displaySearch: false,

      // Headers that are displayed on the ui.
      displayHeaders: [],

      // The table headers.
      headers: [],

      // The logs that will be displayed.
      logs: [],

      // The logs field may be filtered. This filed will hold all logs.
      allLogs: [],

      // Display the number of items that are filtered to the user.
      filterMessage: undefined,

      // Hold the raw data.
      rawData: undefined,

      // Hold the search term that is currently being used.
      searchTerm: '',

      // Hold if we will display sub views via a split screen.
      splitScreen: true
    }
  },

  /***
   * Components used by the view.
   */
  components: {
    // Allow the user to edit log settings.
    SettingsView,

    // Allow the user to search or filter the log.
    SearchView
  },

  /***
   * Method that is called when the view is created. Load the
   * log data.
   */
  created() {
    this.loadUrl = this.url
    this.loadLogData()
  },

  /***
   * Watch for changes.
   */
  watch: {
    /***
     * If we have data then data is loaded.
     */
    logs: function(val) {
      this.logLoaded = val !== undefined

      if (this.logs !== undefined && this.allLogs !== undefined) {
        if (this.logs.length === this.allLogs.length) {
          this.filterMessage = undefined
        } else {
          this.filterMessage =
            'Showing ' +
            this.logs.length +
            ' of ' +
            this.allLogs.length +
            ' logs'
        }
      } else {
        this.filterMessage = undefined
      }
    }
  },

  /***
   * The view methods.
   */
  methods: {
    /***
     * Load a sample file.
     */
    loadSample() {
      this.loadUrl = process.env.VUE_APP_BASEURL + 'sample.log'
      this.loadLogData()
    },

    /***
     * Display a view.
     */
    displayView(view) {
      if (
        this.$vuetify.breakpoint.name === 'xs' ||
        this.$vuetify.breakpoint.name === 'sm'
      ) {
        this.splitScreen = false
      } else {
        this.splitScreen = true
      }

      this.displaySettings = false
      this.displaySearch = false

      if (view === 'settings') {
        this.displaySettings = true
      } else if (view === 'search') {
        this.displaySearch = true
      } else {
        // Closing a display.
        this.splitScreen = true
      }
    },

    /***
     * Load text from a file.
     */
    loadTextFromFile(ev) {
      const file = ev.dataTransfer.files[0]
      const reader = new FileReader()

      var self = this
      reader.onload = function(e) {
        self.rawData = e.target.result
        self.loadLogData()
      }
      reader.readAsText(file)
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
      var response = await this.getDataFromUrl(this.loadUrl)
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
      this.displayHeaders = this.headers

      this.allLogs = parsed.items
      this.logs = parsed.items
    },

    /***
     * Called when logs have been filted.
     */
    onLogsFiltered(item) {
      this.logs = item.logs
      this.searchTerm = item.searchTerm
    },

    /***
     * Called when headers have changed.
     */
    onHeaderChanged(newHeaders) {
      this.displayHeaders = newHeaders
    },

    /***
     * Force the UI to re-render.
     */
    forceRerender() {
      this.componentKey += 1
    }
  },

  computed: {
    componentKey() {
      return this.$vuetify.breakpoint.name === 'xs' ? 1 : 0
    }
  },

  // The values passed into the view.
  props: ['url']
}
</script>
