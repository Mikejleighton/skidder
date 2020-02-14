<template>
  <v-app id="inspire">
    <v-app-bar app color="black" dark>
      <v-toolbar-title>LumberJack</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <log-viewer></log-viewer>
    </v-content>
    <v-footer color="black" app>
      <span class="white--text" style="float:left;">&copy; 2020</span>
      <v-spacer></v-spacer>
      <span class="white--text" style="float:right;">{{version}}</span>
    </v-footer>
  </v-app>
</template>

<script>
import LogViewer from './LogViewer'
import axios from 'axios'
export default {
  /***
   * The data function for the view.
   */
  data() {
    return {
      // The version of the application.
      version: ''
    }
  },

  /***
   * Methods used by the view.
   */
  methods: {
    /***
     * Method that will pull the version of the application thats deployed and
     * set the version member.
     */
    async setVersion() {
      // Get the app version.
      var response = undefined
      try {
        response = await axios({
          url: '/version',
          method: 'GET'
        })
      } catch (error) {
        // TODO: Add a error popup.
        // eslint-disable-next-line
        console.error(error)
        return
      }
      this.version = response.data
    }
  },

  /***
   * Called when the application is loaded.
   */
  created() {
    this.setVersion()
  },

  /***
   * Data passed into the view.
   */
  props: {
    source: String
  },

  /***
   * Components used by the view.
   */
  components: {
    LogViewer
  }
}
</script>
