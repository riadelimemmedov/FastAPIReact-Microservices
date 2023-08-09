import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //*If you have deploy application on docker comment out this area
  // server: {
  //   host: true,
  //   port: 8000, // This is the port which we will use in docker
  //   watch: {
  //     usePolling: true
  //   }
  // }
})
