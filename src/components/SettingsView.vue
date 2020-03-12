<template>
  <v-card class="elevation-5" style="height:105%; margin-top:-5px; padding-right:10px;">
    <v-toolbar class="elevation-0">
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="onClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list-item>
    <p>
      The following settings can be used to modify the application. 
    </p>
    </v-list-item>

    <v-card-title>
      Columns
    </v-card-title>
    <v-list-item>
      <v-col>
        <v-row>
          <p>
            Use the following settings to decide which columns should be
            displayed.
          </p>
        </v-row>

        <v-row class="justify-center">
          <v-list>
            <v-list-item v-for="(item, index) in displayItems" :key="index">
              <v-switch :label="item.text" v-model="item.on" @click.native="headerChanged()"></v-switch>
            </v-list-item>
          </v-list>
        </v-row>
      </v-col>
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
      // Display the items.
      displayItems: undefined
    }
  },

  /***
   * Called when the view is created.
   */
  created() {
    this.displayItems = this.headers
    for (var i = 0; i < this.displayItems.length; i++) {
      this.displayItems[i].on = true
    }
  },

  /***
   * Methods used by the view.
   */
  methods: {

    /***
     * Called when a header value has been changed. 
     */
    headerChanged(){
      //item.on = !item.on;

      //eslint-disable-next-line
      //console.log(item)
      /*
      var index = -1;
      for(var i = 0; i < this.displayItems.length; i++){
        if(item.text === this.displayItems[i].text){
          index = i
        }
      }
      if(index >= 0){
        this.displayItems.splice(index, 1)
      }*/
      var items = []
      for(var i = 0; i < this.displayItems.length; i++){
        if(this.displayItems[i].on){
          items.push(this.displayItems[i])
        }
      }
      this.$emit('onHeaderChanged', items)
    },

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
  props: ['headers']
}
</script>
