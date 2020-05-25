<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader @search="handleSearch" v-bind="$attrs" v-on="$listeners"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <ResourceInfoCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="less" scoped>

</style>

<script>
import { mapActions } from 'vuex'

const ResourceInfoCard = () => import('@/components/ResourceInfoCard')
const MenuHeader = () => import('@/components/MenuHeader')

export default {
  name: 'ResourcesPage',
  components: {
    ResourceInfoCard,
    MenuHeader
  },
  data () {
    return {

    }
  },
  methods: {
    handleSearch (val) {

    }
  }
}
</script>
