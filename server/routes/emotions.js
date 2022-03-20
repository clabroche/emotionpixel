const express = require('express');
const moment = require('moment')
moment.locale('fr')
const {mongo} = require('../helpers/mongoConnect')
const authMiddleWare = require('../middleware/auth')
const router = express.Router();
router.get('/', authMiddleWare, async (req, res, next) => {
  let emotions = await mongo.collection('emotions').find({ userId: req.user._id }).toArray()
  if (!emotions.length) {
    emotions = [
      { userId: mongo.getID(req.user._id), color: 'rgb(116,255,5)', label: 'Beaucoup de joie' },
      { userId: mongo.getID(req.user._id), color: 'rgb(86,200,34)', label: 'Joie' },
      { userId: mongo.getID(req.user._id), color: 'rgb(195,200,34)', label: 'Normal' },
      { userId: mongo.getID(req.user._id), color: 'rgb(200,122,34)', label: 'Stress' },
      { userId: mongo.getID(req.user._id), color: 'rgb(200,39,34)', label: 'Colère' },
      { userId: mongo.getID(req.user._id), color: 'rgb(34,117,200)', label: 'Tristesse' },
      { userId: mongo.getID(req.user._id), color: 'rgb(200,34,97)', label: 'Malade' },
    ]
    await mongo.collection('emotions').insertMany(emotions)
  }
  res.json(emotions)
})
router.get('/my', authMiddleWare, async (req, res, next) => {
  let myEmotions = await mongo.collection('myEmotions').findOne({ userId: req.user._id })
  res.json(myEmotions || {})
})
router.post('/date/:dateISO/emotionId/:emotionId', authMiddleWare, async (req, res, next) => {
  const date = moment(req.params.dateISO)
  const emotionId = req.params.emotionId
  const update = {}
  update[date.format('DD/MM/YYYY')] = mongo.getID(emotionId)
  await mongo.collection('myEmotions').updateOne({ userId: req.user._id }, { $set: update }, { upsert: true })
  res.json(true)
})
router.delete('/date/:dateISO', authMiddleWare, async (req, res, next) => {
  const date = moment(req.params.dateISO)
  const update = {}
  update[date.format('DD/MM/YYYY')] = 1
  await mongo.collection('myEmotions').updateOne({ userId: req.user._id }, { $unset: update }, { upsert: true })
  res.json(true)
})
router.delete('/:id', authMiddleWare, async (req, res, next) => {
  await mongo.collection('emotions').deleteOne({ userId: req.user._id,  _id: mongo.getID(req.params.id)})
  res.json(true)
})

router.post('/:emotionId/color/:color', authMiddleWare, async (req, res, next) => {
  const { emotionId, color } = req.params
  const match = { _id: mongo.getID(emotionId), userId: req.user._id }
  await mongo.collection('emotions').updateOne(match, { $set: { color } })
  res.json(true)
})

router.post('/', authMiddleWare, async (req, res, next) => {
  const { label, color } = req.body
  const result = await mongo.collection('emotions').insertOne({
    label, color, userId: req.user._id
  })
  res.json(result.insertedId)
})

  
module.exports = router