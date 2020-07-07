<template>
  <div>
    <v-row>
      <v-col v-for="n in 6" v-bind:key="n" cols="4">
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Top 10 Australian beaches</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="orange"
              text
            >
              Share
            </v-btn>

            <v-btn
              color="orange"
              text
            >
              Explore
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-if="resList.length"
      color="#00a4ff"
      v-model="currentPage"
      :length="totalPages"
      :total-visible="7"
      @input="handlePageChange"
      @next="handleNextPage"
      @previous="handlePrevPage"
    ></v-pagination>
  </div>
</template>

<style scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

@Component
export default class ResourcesList extends Vue {

  resList : any = [1]
  currentPage : number = 1
  currentPageSize : number = 10
  totalPages : number = 1
  totalElements : number = 0

  refreshResources (page : number = 0, pageSize : number = 10) : void {

  }

  handlePageChange (val : any) : void {
    this.currentPage = val
    this.refreshResources(val - 1, this.currentPageSize)
  }

  handlePrevPage () : void {
    this.refreshResources(this.currentPage - 1, this.currentPageSize)
  }

  handleNextPage () : void {
    this.refreshResources(this.currentPage - 1, this.currentPageSize)
  }
}
</script>