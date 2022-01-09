import Axios from 'axios'
console.log(import.meta.env)
export default Axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`
})
