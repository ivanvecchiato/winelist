<template>
  <div class="main">
    <img alt="Vue logo" src="../assets/logo.png" :class="{scaleImage : scaling}">
    <b-container class="bottom">
      <b-row class="justify-content-md-center">
        <b-col cols="1">
          <b-list-group flush>
            <b-list-group-item button>
              <span class="vertical" @click="loadList()">{{$t('generic.all')}}</span>
            </b-list-group-item>
            <b-list-group-item button v-for="typology, index in typologies" :key="typology">
              <span class="vertical" @click="loadList(types[index])">{{typology}}</span>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col class="center">
          <component
            :is="currentContent"
            v-bind="currentProperties"
            :key="randKey()"></component>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Tipologies from '../data/Tipologies'
import Tipology from '../data/Tipology'
import Favorites from '../components/Favorites.vue'
import List from '../components/List.vue'

export default {
  name: 'Main',
  components: {Favorites, List},
  data() {
    return {
      typologies: Tipologies,
      types: Tipology,
      currentContent: Favorites,
      currentType: '',
      scaling: false
    }
  },
  computed: {
    currentProperties: function() {
      if (this.currentContent == List) {
        return { tipology: this.currentType }
      } else {
        return null;
      }
    }
  },
  methods: {
    randKey: function () {
      return Number(Math.ceil(Math.random()*100));
    },
    loadList: function(type) {
      this.scaling = true;
      this.currentType = type;
      this.currentContent = List;
    }
  },
  mounted() {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  position: relative;
  height: 100vh;
}
.bottom {
  bottom: 0px;
  left: 0px;
}
.vertical {
    writing-mode:tb-rl;
    transform: rotate(180deg);
    color: rgb(47, 116, 139);
    font-weight: bold;
    font-size: 1.4em;
}
.center {
  margin: 20px;
}
.scaleImage {
  -webkit-transition: 2s;
  -moz-transition: 2s;
  -ms-transition: 2s;
  -o-transition: 2s;
  transition: 2s;
  margin-left: 50%;
  transform: scale(0.5);
}

</style>
