<template>
  <div id="app">
    <div class="overlay" :class="{open: sidebar.open}" @click="sidebar.open = false"></div>
    <div class="sidebar" :class="{open: sidebar.open}">
      <ul>
        <li @click="$router.push({name: 'years'}); sidebar.open = false">
          <i class="fas fa-border-none"></i>
          Mon année
        </li>
         <li @click="$router.push({name: 'month'}); sidebar.open = false">
          <i class="fas fa-border-none"></i>
          Mon mois
        </li>
         <li @click="$router.push({name: 'stats'}); sidebar.open = false">
          <i class="fas fa-chart-pie"></i>
          Mes statistiques
        </li>
      </ul>
      <ul>
        <a href="http://emotionpixel.corentinlabroche.fr/emotionpixel.apk">
          <li>
            <i class="fab fa-google-play"></i>
            Télecharger
          </li>
        </a>
        <li @click="disconnect">
          <i class="fas fa-plug"></i>
          Déconnection
        </li>
      </ul>
    </div>
    <div id="nav" v-if="$route.name !== 'login'">
      <div class="trigger" v-if="Auth.authenticated" @click="sidebar.open = true"><i class="fas fa-list"></i></div>
      {{Header.title}}
    </div>
    <div class="app-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from './services/Header'
import sidebar from './services/sidebar'
import Auth from './services/Auth'
export default {
  data() {
    return {
      Header,
      sidebar,
      Auth
    }
  },
  async mounted() {
    await Auth.getUser().catch(err => {err})
     if(!Auth.user) {
        this.$router.push({name: 'login'})
      } 
  },
  methods: {
    disconnect() {
      this.$router.push({name: 'login'})
      Auth.disconnect()
      sidebar.open = false
    }
  }
}
</script>
<style lang="scss">
.v--modal-overlay .v--modal-box {
  overflow: visible !important;
}
:root {
  --fontSize: 1em;
  --borderRadius: 0px;
  --headerBorderWidth: 0px;
  --headerBorderColor: transparent;
  --headerBgColor: #466c80;
  --headerBgColorAccent: #2f5466;
  --headerTextColor: white;
  --headerFontWeight: bold;
  --headerIconTextColor: #ffffff;
  --contentBorderWidth: 1px;
  --contentBorderColor: #dddddd;
  --contentBgColor: #ffffff;
  --contentTextColor: #362b36;
  --stateDefaultBorderWidth: 0px;
  --stateDefaultBorderColor: transparent;
  --stateDefaultBgColor: #466c80;
  --stateDefaultTextColor: #ffffff;
  --stateActiveBorderColor: transparent;
  --stateActiveBgColor: #7CB342;
  --stateActiveTextColor: #ffffff;
  --stateHighlightBorderColor: transparent;
  --stateHighlightBgColor: #7CB342;
  --stateHighlightTextColor: #ffffff;
  --stateFocusBorderColor: transparent;
  --stateFocusBgColor: #e4f1fb;
  --stateFocusTextColor: #0070a3;
  --stateErrorBorderColor: transparent;
  --stateErrorBgColor: #cd0a0a;
  --stateErrorTextColor: #ffffff;
  --stateHoverBorderColor: transparent;
  --stateHoverBgColor: #455a64;
  --stateHoverTextColor: white;
  --inputBgColor: #ffffff;
  --inputTextColor: #222222;
  --invalidInputBorderColor: transparent;
  --inputGroupTextColor: #2779aa;
  --inputDefaultBorderWidth: 1px;
  --inputDefaultBorderColor: #dddddd;
  --inputDefaultBgColor: #ffffff;
  --inputDefaultTextColor: #000000;
}
input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 5px;
  margin-top: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: var(--headerBgColor);
  color: var(--headerTextColor);
  border: none;
}
body {
  margin: 0;
  height: 100vh;
  width: 100vw;
}
ul {
  margin: 0;
  padding: 0;
  a{
    text-decoration: none;
    color: inherit;
  }
  li {
    margin: 0;
    list-style-type: none;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(70vh)
}
</style>
<style lang="scss">
@import url('~@fortawesome/fontawesome-free/css/all.min.css');

</style>
<style lang="scss" scoped>
.overlay {
  z-index: 1300;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  transform: translateX(-100vw);
  transition: 500ms;

  &.open {
      transform: translateX(0);
  }
}
.sidebar {
  height: 100vh;
  max-width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0px 0px 8px 2px black;
  z-index: 1300;
  transform: translateX(-100vw);
  transition: 300ms;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &.open {
      transform: translateX(0);
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 1.3em;
  }
  ul {
    margin-top: 10px;
    font-size: 1.3em;
    li {
      padding: 10px;
      &:hover {
        background-color: rgba(0,0,0,0.2);
        cursor: pointer;
      }
    }
    i {
      margin-right: 10px
    }
  }
}
input, textarea {
  font-family: Jost;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-family: Jost;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-content {
  height: calc(100% - 45px);
  overflow: auto;
}

#nav {
  z-index: 1299;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-weight: bold;
  color: white;
  background-color: var(--headerBgColor);
  box-shadow: 0px 0px 9px 5px #303030;
  flex-shrink: 0;
  .trigger {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1.5em;
    padding: 10px;
  }
}
</style>
