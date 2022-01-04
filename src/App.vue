<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
import Home from './views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>

@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"),   url(./fonts/Montserrat-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Montserrat-Black";
  src: local("Montserrat-Black"),   url(./fonts/Montserrat-Black.ttf) format("truetype");
}
@font-face {
  font-family: "Montserrat-Bold";
  src: local("Montserrat-Bold"),   url(./fonts/Montserrat-Bold.ttf) format("truetype");
}

#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
:root{
  --color-primary: #795548;
  --color-secondary: rgb(153, 143, 143);
  --color-highlight: #B71C1C;
  --color-light: #FFECB3
}
</style>
