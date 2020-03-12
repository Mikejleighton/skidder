<template>
  <v-card class="elevation-5" style="height:105%; margin-top:-5px; padding-right:10px;">
    <v-toolbar class="elevation-0">
      <v-toolbar-title>Search</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="onClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list-item>
      <p>
        Type the search term into the following field and the log will filter to
        matching items.
      </p>
    </v-list-item>

    <v-list-item>
      <v-text-field
        color="black"
        v-model="searchTerm"
        label="Search"
        autofocus
      ></v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  /***
   * Hold that data that is used by the view.
   */
  data() {
    return {
      searchTerm: ''
    }
  },

  /***
   * Called when the view is created.
   */
  created() {
    this.searchTerm = this.search
  },

  /***
   * Watch for changes to data.
   */
  watch: {
    /***
     * Called when the search term is changed.
     */
    searchTerm: function(value) {
      var logsFound = []
      for (var i = 0; i < this.logs.length; i++) {
        var item = this.logs[i]

        var values = Object.values(item)
        for (var j = 0; j < values.length; j++) {
          if (
            values[j].includes !== undefined &&
            values[j].toLowerCase().includes(value.toLowerCase())
          ) {
            logsFound.push(item)
            break
          }
        }
      }

      this.$emit('onLogsFiltered', {
        logs: logsFound,
        searchTerm: this.searchTerm
      })
    }
  },

  /*
  created(){
    this.$emit('onLogsFiltered', [this.logs[0]])
  },*/

  /***
   * Methods used by the view.
   */
  methods: {
    /***
     * Called when the view is closed.
     */
    onClose() {
      this.$emit('onClose')
    }
  },

  /***
   * The views passed into the settings view.
   */
  props: ['logs', 'search']
}
</script>
