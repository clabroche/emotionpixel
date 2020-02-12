let BASE 
BASE = "emotionpixel"
const path =require('path')
const mongoDbURL = `mongodb://root:123456@localhost:27017/${BASE}?authSource=admin`
const stack = [
  {
    label: 'Emotion pixel: server',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'serve'],
    spawnOptions: {
      cwd:  path.resolve(__dirname, 'server'),
      env: Object.assign({ mongoDbURL }, process.env)
    }
  },
  {
    label: 'Emotion pixel: front',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'serve'],
    spawnOptions: {
      cwd:  __dirname,
      env: Object.assign({ mongoDbURL }, process.env)
    }
  }
]

module.exports = stack
