<template>
  <div class="root-map">
    <table>
      <tr>
        <th ></th>
        <th v-for="month of months" :key="month.label">{{month.label.slice(0,3)}}</th>
      </tr>
      <tr v-for="dayNumber in 31" :key="dayNumber.label">
        <td ><div class="dayNumber">{{dayNumber}}</div></td>
        <td v-for="(month, i) of months" :key="month.label"
          :class="{dateInexistance: moment().set({date:dayNumber, month: i}).month() !== i}"
          :style="{backgroundColor: getColor(moment().set({date:dayNumber, month: i}).format('DD/MM/YYYY'))}"
          @click="selected = moment().set({date:dayNumber, month: i}).month() === i ? moment().set({date:dayNumber, month: i}) : null">
        </td>
      </tr>
    </table>
    <edit-emotion-day :selected="selected" @input="updateEmotion($event)"/>
  </div>
</template>

<script>
import moment from 'moment'
import Emotions from '../services/Emotions'
import Header from '../services/Header';
import EditEmotionDayVue from '../components/EditEmotionDay.vue';
export default {
  components: {
    'edit-emotion-day': EditEmotionDayVue
  },
  data() {
    return {
      moment,
      months: moment.months().map(monthName => {
        return {
          label: monthName,
          days: Array(moment().month(monthName) .daysInMonth()).fill('').map(_=> null)
        }
      }),
      myEmotions: {},
      emotions: [],
      selected: null
    }
  },
  async mounted() {
    Header.title = 'Emotion Pixel'
    this.emotions = await Emotions.all()
    this.emotions.push({
      _id: 'null',
      label: 'Aucune émotion',
      color: 'rgb(255,255,255)'
    })
    this.myEmotions = await Emotions.my()
    console.log(this.emotions)
     if(window.cordova) {
      await this.appReady()
    }
  },
  methods: {
    getColor(date) {
      if(!this.myEmotions) return ''
      const emotionId = this.myEmotions[date]
      const emotion = this.emotions.filter(emotion => emotion._id === emotionId).pop()
      return emotion ? emotion.color : ''
    },
    updateEmotion(ev) {
      this.myEmotions[ev.date.format('DD/MM/YYYY')] = ev.emotion._id
      this.selected = null
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  tr {
    display: flex;
    flex-grow: 1;
    th, td {
      flex-shrink: 0;
      border: 1px solid black;
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc((100vw / 13) - (2px *13))
    }
    td {
      transition: 300ms;
      position: relative;
      &.dateInexistance {
        background-color: black !important;
      }
      .dayNumber{
        position: absolute;
      }
    }
  }
}
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