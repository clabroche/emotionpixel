<template>
  <div>
     <transition name="fade">
      <div class="slider" v-if="selected" :key="selected.format('L')">
        <div class="close "><i class="fas fa-times" @click="selected = null"></i></div>
        {{selected.format('L')}}
        Choisir mon humeur
        <div class="emotions">
          <div v-for="emotion of emotions" :key="emotion._id" class="emotion" @click="selectEmotion(selected, emotion)">
            <div class="label" :style="{backgroundColor: emotion.color}"/>
            <div class="palette" @click.stop="updateEmotionColor = emotion"><i class="fas fa-palette"></i></div>
            {{emotion.label}}
          </div>
        </div>
      </div>
    </transition>
     <transition name="fade">
      <div class="slider" v-if="updateEmotionColor" :key="updateEmotionColor._id">
        <div class="close "><i class="fas fa-times" @click="updateEmotionColor = null"></i></div>
          <verte model="rgb" menuPosition="top" v-model="updateEmotionColor.color" @input="debouncedUpdateEmotionColorInApi(updateEmotionColor)"></verte>
      </div>
     </transition>
  </div>
</template>

<script>
import Verte from 'verte'
import Emotions from '../services/Emotions'
import debounce from 'debounce'
export default {
  components: {
    verte: Verte,
  }, 
  props: {
    selected: {default: null}
  },
  data() {
    return {
      updateEmotionColor: null,
      emotions: [],
    }
  },
  async mounted() {
    this.emotions = await Emotions.all()
  },
  methods: {
    async updateEmotionColorInApi(emotion) {
      await Emotions.updateColor(emotion)
    },
    debouncedUpdateEmotionColorInApi: debounce(function(emotion) {
      this.updateEmotionColorInApi(emotion)
    }, 300),
    async selectEmotion(date, emotion) {
      await Emotions.update(date.toISOString(), emotion._id)
      this.$emit('input', {date, emotion})
    }
  }
}
</script>

<style lang="scss" scoped>

.slider {
  position: fixed;
  right: 0;
  bottom:0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #3c3b42;
  color: white;
  border-top: 4px solid #3d7cc6;
  box-shadow: 0px 1px 4px 5px #4a4a4a;
  max-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .emotions {
    display: flex;
    overflow: auto;
    width: 100%;
    .emotion {
      flex-shrink: 0;
      margin: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255,255,255,0.1);
      padding: 10px;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      text-align: center;
      transition: 300ms;
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: rgba(255,255,255,0.2);
      }
      .palette {
        position: absolute;
        bottom: 4px;
        right: 4px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        color: #AAA;
        border: 1px solid #AAA;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .label {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
  }
}
</style>