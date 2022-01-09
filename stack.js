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
      env: Object.assign({ mongoDbURL, PORT: 4545}, process.env),
    }
  },
  {
    label: 'Emotion pixel: front',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'serve:front'],
    spawnOptions: {
      cwd:  __dirname,
      env: Object.assign({ 
        VITE_SERVER_URL:"http://localhost",
        VITE_SERVER_PORT: 4545,
       }, process.env)
    }
  }
]

module.exports = stack
