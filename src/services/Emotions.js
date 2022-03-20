import API from "./API"
import Auth from "./Auth"
/**
 * 
 * @param {Emotion} emotion 
 */
// @ts-ignore
function Emotion(emotion = {}) {
  this._id = emotion._id || null
  this.label = emotion.label || null
  this.color = emotion.color
}

Emotion.all = async function () {
  const { data: emotions } = await API.get(`/emotions`, {
    headers: { token: Auth.token }
  })
  return emotions.map(emotion => new Emotion(emotion))
}

Emotion.my = async function () {
  const { data: emotions } = await API.get(`/emotions/my`, {
    headers: { token: Auth.token }
  })
  return emotions
}


Emotion.updateColor = async function (emotion) {
  await API.post(`/emotions/${emotion._id}/color/${emotion.color}`, null, {
    headers: { token: Auth.token }
  })
}

Emotion.update = async function (dateISO, emotionId) {
  await API.post(`/emotions/date/${dateISO}/emotionId/${emotionId}`, null, {
    headers: { token: Auth.token }
  })
}
Emotion.add = async function (emotion) {
  const {data: id}  = await API.post(`/emotions`, emotion, {
    headers: { token: Auth.token }
  })
  return id
}

Emotion.remove = async function (dateISO) {
  await API.delete(`/emotions/date/${dateISO}`, {
    headers: { token: Auth.token }
  })
}
Emotion.delete = async function (id) {
  await API.delete(`/emotions/${id}`, {
    headers: { token: Auth.token }
  })
}

export default Emotion
