<template>
  <div class="root-stats">
    <div class="stat-container">
      <div class="month-selector">
        <div @click="currentMonthNumber--"><i class="fas fa-chevron-left"></i></div>
        <div>
          Pour le mois de
          {{moment().set({month: currentMonthNumber}).format('MMMM YYYY ')}}
        </div>
        <div @click="currentMonthNumber++"><i class="fas fa-chevron-right"></i></div>
      </div>
      <pie-chart width="100%" :series="datacollectionMonth.data" :labels="datacollectionMonth.labels" :colors="datacollectionMonth.backgroundColor"/>
    </div>
    <div class="stat-container">
        <div class="month-selector">
        <div @click="currentYearNumber--"><i class="fas fa-chevron-left"></i></div>
        <div>
          Pour l'année
          {{moment().set({year: currentYearNumber}).format('YYYY ')}}
        </div>
        <div @click="currentYearNumber++"><i class="fas fa-chevron-right"></i></div>
      </div>
      <pie-chart width="100%" :series="datacollectionYear.data" :labels="datacollectionYear.labels" :colors="datacollectionYear.backgroundColor"/>
    </div>
    <!-- <div class="floating-button" @click="chartType = chartType ==='bar-chart' ? 'pie-chart':'bar-chart'">
      <i class="fa" :class="{'fa-chart-bar': chartType ==='pie-chart', 'fa-chart-pie': chartType ==='bar-chart'}"></i>
    </div> -->
  </div>
</template>

<script>
import Header from '../services/Header'
import Emotions from '../services/Emotions'
import BarChartVue from '../components/PieChart.vue'
import {groupBy} from 'lodash-es'
import moment from 'moment'
export default {
  components: {
    'pie-chart': BarChartVue,
  },
  computed: {
    datacollectionMonth() {
      const startDate = moment().set({months: this.currentMonthNumber}).startOf('month')
      const endDate = moment().set({months: this.currentMonthNumber}).endOf('month')
      const emotions = this.getAllEmotionsBetween(startDate, endDate)      
      return this.getCollectionFromEmotions(emotions)
    },
    datacollectionYear() {
      const startDate = moment().set({year: this.currentYearNumber}).startOf('year')
      const endDate = moment().set({year: this.currentYearNumber}).endOf('year')
      const emotions = this.getAllEmotionsBetween(startDate, endDate)      
      return this.getCollectionFromEmotions(emotions)
    }
  },
  data() {
    return {
      emotions: [],
      chartType: 'pie-chart',
      myEmotions: {},
      datacollection: null,
      currentMonthNumber: moment().month(),
      currentYearNumber: moment().year(),
      moment
    }
  },
  async mounted() {
    Header.title = 'Statistiques'
    this.emotions = await Emotions.all()
    this.emotions.push({
      _id: null,
      label: 'Aucune émotion',
      color: 'rgb(255,255,255)'
    })
    this.myEmotions = await Emotions.my()
  },
  methods: {
    getCollectionFromEmotions(emotions) {
      const myEmotionsForMonthGrouped = groupBy(emotions)
      const myEmotionsForMonthGroupedArr = Object.keys(myEmotionsForMonthGrouped)
        .map(id => {
          return {
            id,
            nb: myEmotionsForMonthGrouped[id].length 
          }
        })
      myEmotionsForMonthGroupedArr.sort((a,b) => b.nb - a.nb)
      const labels = []
      const data = []
      const backgroundColor = []
      for (let index = 0; index < myEmotionsForMonthGroupedArr.length; index++) {
        const elem = myEmotionsForMonthGroupedArr[index]
        const emotion = this.emotions.filter(emo => emo._id === elem.id).pop()
        if(emotion && elem.id !== null) {
          labels.push(emotion.label)
          backgroundColor.push(emotion.color)
          data.push(elem.nb)
        }
      }
      return  {
        labels,
        borderColor: "#AAAAAA",
        borderWidth: "2px",
        backgroundColor,
        data  
      }
    },
    getAllEmotionsBetween(startDate, endDate) {
      const date = startDate.clone()
      const dates = []
      while(date.format('DD/MM/YYYY') !== endDate.format('DD/MM/YYYY')) {
        const emotion = this.myEmotions && this.myEmotions[date.format('DD/MM/YYYY')]
          ? this.myEmotions[date.format('DD/MM/YYYY')]
          : null
        dates.push(emotion)
        date.add(1, 'days')
      }
      return dates
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
.floating-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: #1e2225;
  color: white;
  font-size: 2em;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%

}
.stat-container {
  width: 90%;
  margin: 10px auto ;
  border: 1px solid #344a56;
}
.pie {
  width: 60%;
  box-sizing: border-box;
  margin: auto;
  padding: 15px;
}
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
  &.header {
    height: 2em
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