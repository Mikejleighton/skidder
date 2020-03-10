<template>
  <div
    style="height:100%; background-color:#1E1E1E;"
    @drop.prevent="loadTextFromFile"
    @dragover.prevent
  >
    <v-row style="height:100%; background-color:#1E1E1E;">

      <!-- No data -->
      <v-col v-if="!logLoaded" style="height:100%; color:white; background-color:#1E1E1E;">
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
      <v-col v-if="logLoaded" style="height:100%;">
        <v-toolbar dark class="elevation-0" color="#1E1E1E" dense>
          <v-spacer></v-spacer>
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
      <v-col v-if="displaySettings" style="max-width:400px; height:100%;">
        <settings-view
          v-on:onClose="displayView(undefined)"
          v-on:onHeaderChanged="onHeaderChanged"
          v-bind:headers="headers"
        ></settings-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import LogParser from '../api/LogParser'
import SettingsView from './SettingsView.vue'
//import dinoql from 'dinoql'
export default {
  /***
   * The data function for the view.
   */
  data() {
    return {
      loadUrl: undefined,

      // Hold if a log has been loaded.
      logLoaded: false,

      // Hold if we should display the settings panel.
      displaySettings: false,

      // Headers that are displayed on the ui.
      displayHeaders: [],

      // The table headers.
      headers: [],

      // The logs that will be displayed.
      logs: [],

      // Hold the raw data.
      rawData: undefined
    }
  },

  /***
   * Components used by the view.
   */
  components: {
    // Allow the user to edit log settings.
    SettingsView
  },

  /***
   * Method that is called when the view is created. Load the
   * log data.
   */
  created() {
    this.loadUrl = this.url;
    this.loadLogData()
  },

  /***
   * Watch for changes. 
   */
  watch: {

    /***
     * If we have data then data is loaded. 
     */
    logs: function(val){
      this.logLoaded = val !== undefined
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
      this.loadUrl = '/sample.log'
      this.loadLogData()
    },

    /***
     * Display a view.
     */
    displayView(view) {
      this.displaySettings = false
      if (view === 'settings') {
        this.displaySettings = true
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
      this.logs = parsed.items
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
