<template>
  <v-app id="inspire">
    <v-app-bar app color="black" dark>
      <v-toolbar-title>LumberJack</v-toolbar-title>
    </v-app-bar>

    <v-content >
        <log-viewer></log-viewer>
    </v-content>
    <v-footer color="black" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import LogViewer from './LogViewer';
export default {
  props: {
    source: String
  },

  components: {
    LogViewer,
  },

  data: () => ({
    drawer: null
  })
}
</script>
