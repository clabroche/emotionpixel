<template>
  <div>
    <transition name="fade">
      <div class="slider" v-if="selected" :key="selected.format('DD/MM/YYYY')">
        <div class="close "><i class="fas fa-times" @click="selected = null"></i></div>
        {{selected.format('DD/MM/YYYY')}}
        Choisir mon humeur
        <div class="emotions">
          <div class="emotion" @click="remove(selected)">
            <div class="label" :style="{backgroundColor: 'white'}"/>
            Supprimer
          </div>
          <div v-for="emotion of emotions" :key="emotion._id" class="emotion" @click="selectEmotion(selected, emotion)">
            <div class="label" :style="{backgroundColor: emotion.color}"/>
            <div class="palette" @click.stop="updateEmotionColor = emotion"><i class="fas fa-palette"></i></div>
            <div class="delete" @click.stop="deleteColor(emotion._id, selected)"><i class="fas fa-times"></i></div>
            {{emotion.label}}
          </div>
          <div class="emotion" @click="add(selected)">
            <div class="label" :style="{backgroundColor: 'white'}"/>
            Ajouter
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
    <div class="slider" v-if="updateEmotionColor" :key="updateEmotionColor._id">
      <div class="close "><i class="fas fa-times" @click="updateEmotionColor = null"></i></div>
        <color-picker v-model:pureColor="updateEmotionColor.color" @update:pureColor="debouncedUpdateEmotionColorInApi(updateEmotionColor)"></color-picker>
    </div>
    </transition>
    <modal ref="addModal">
      <template #body>
        <div>
          Nom de l'émotion
          <input type="text" v-model="newEmotion.label" id="">
        </div>
        <div>
          Couleur
          <color-picker v-model:pureColor="newEmotion.color" @update:pureColor="debouncedUpdateEmotionColorInApi(updateEmotionColor)"></color-picker>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import Emotions from '../services/Emotions'
import debounce from 'debounce'
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import Modal from './Modal.vue'

export default {
  components: {
    ColorPicker,
    Modal
  }, 
  props: {
    selected: {default: null}
  },
  data() {
    return {
      updateEmotionColor: null,
      emotions: [],
      newEmotion: null
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
    },
    async remove(date) {
      await Emotions.remove(date.toISOString())
      this.$emit('input', {date})
    }, 
    async deleteColor(_id, date) {
      await Emotions.delete(_id)
      this.$emit('reload')
      this.$emit('input', {date})
      this.emotions = await Emotions.all()
    },
    async add(date) {
      this.newEmotion = {}
      this.$refs.addModal.open().subscribe(async res => {
        if(!res) return
        const id = await Emotions.add(this.newEmotion)
        this.selectEmotion(date, {... this.newEmotion, _id: id})
        this.$emit('reload')
        this.newEmotion = {}
      })
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
      .palette, .delete {
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
      .delete {
        left:  4px;
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