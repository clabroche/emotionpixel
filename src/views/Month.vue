<template>
  <div class="root-map">
    <div class="month-selector">
      <div @click="currentMonthNumber--"><i class="fas fa-chevron-left"></i></div>
      <div>
        {{moment().set({month: currentMonthNumber}).format('MMMM YYYY ')}}
      </div>
      <div @click="currentMonthNumber++"><i class="fas fa-chevron-right"></i></div>
    </div>
    <div class="grid header">
      <div class="header title" v-for="day of days" :key="day">{{moment().set({d: day}).format('dddd')}}</div>
    </div>
    <div class="grid">
      <div
        v-for="day of moment().set({month: currentMonthNumber}).daysInMonth()" :key="day"
        @click="selected = moment().set({date:day, month: currentMonthNumber}).month() === currentMonthNumber ? moment().set({date:day, month: currentMonthNumber}) : null"
          :style="{backgroundColor: getColor(moment().set({date:day, month: currentMonthNumber}).format('DD/MM/YYYY'))}"
      >{{day}}</div>
    </div>
    <edit-emotion-day @reload="reload" :selected="selected" @input="updateEmotion($event)"/>
  </div>
</template>

<script>
import moment from 'moment'
import Emotions from '../services/Emotions'
import Header from '../services/Header';
import {times} from 'lodash-es'
import EditEmotionDayVue from '../components/EditEmotionDay.vue';
moment.locale('fr')
export default {
  components: {
    'edit-emotion-day': EditEmotionDayVue
  },
  computed: {
    days() {
      const daysInMonth = [];
      const monthDate = moment().set({month: this.currentMonthNumber}).startOf('month'); // change to a date in the month of interest
      times(7, function (n) {
        daysInMonth.push(monthDate.format('dddd'));  // your format
        monthDate.add(1, 'days')
      });
      return daysInMonth
    }
  },
  data() {
    return {
      moment,
      currentMonthNumber: moment().month(),
      myEmotions: {},
      emotions: [],
      selected: null
    }
  },
  async mounted() {
    Header.title = 'Emotion Pixel'
    await this.reload()
    if(window.cordova) {
      await this.appReady()
    }
  },
  methods: {
    async reload() {
      this.emotions = await Emotions.all()
      this.emotions.push({
        _id: 'null',
        label: 'Aucune émotion',
        color: 'rgb(255,255,255)'
      })
      this.myEmotions = await Emotions.my()
    },
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
.month-selector {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #344a56;
  color: white;
  i {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 300ms;
    &:hover {
      background-color: #1e2225;
    }
  }
}
.grid {
  width: 100%;
  height: calc(100vh - 120px);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap:1px;
  .title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    justify-content: flex-start;
    flex-wrap: nowrap;
    flex-shrink: 0;
  }
  &.header {
    height: 2em;
  }
  &>div {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:0 0 0 1px black;
    background-color: #fff;
  }
}
</style>