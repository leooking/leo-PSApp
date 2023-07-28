import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const config = {
  plugins: [vue()],
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}

const chainsProd = 'psci-prod-chains-kuvr57zz5a-uc.a.run.app/'
const chainsDev = 'psci-stag-chains-zcfe4iexva-uc.a.run.app/'

export default defineConfig(({ command, mode, ssrBuild }) => {
  console.log(command, mode, '++++++')
  if (command === 'build' && mode === 'production') {
    config.define = {
      VITE_API_URL: JSON.stringify(
        // 'https://psci-prod-api-kuvr57zz5a-uc.a.run.app'
        'https://api.procurementsciences.com'
      ),
      VITE_CHAINS_URL: JSON.stringify(chainsProd),
      // VITE_API_URL: JSON.stringify("https://psci-prod-api.herokuapp.com"),
    }
    return {
      ...config,
    }
  } else if (command === 'build' && mode === 'staging') {
    config.define = {
      VITE_API_URL: JSON.stringify(
        'https://psci-stag-api-zcfe4iexva-uc.a.run.app'
      ),
      VITE_API_MODE: JSON.stringify('dev'),
      VITE_CHAINS_URL: JSON.stringify(chainsDev),
      // VITE_API_URL: JSON.stringify("https://psci-stag-api.herokuapp.com"),
    }
    return {
      ...config,
    }
  } else {
    if (mode === 'staging')
      config.define = {
        VITE_API_URL: JSON.stringify(
          'https://psci-stag-api-zcfe4iexva-uc.a.run.app'
        ),
        VITE_API_MODE: JSON.stringify('dev'),
        VITE_CHAINS_URL: JSON.stringify(chainsDev),
        // VITE_API_URL: JSON.stringify("https://psci-stag-api.herokuapp.com"),
      }
    else if (mode === 'localhost')
      config.define = {
        // VITE_API_URL: JSON.stringify("https://psci-stag-api-zcfe4iexva-uc.a.run.app"),
        VITE_API_URL: JSON.stringify('http://localhost:3000'),
        VITE_CHAINS_URL: JSON.stringify(chainsDev),
      }
    else if (mode === 'production')
      config.define = {
        VITE_API_URL: JSON.stringify(
          'https://psci-prod-api-kuvr57zz5a-uc.a.run.app'
        ),
        VITE_CHAINS_URL: JSON.stringify(chainsProd),
        // VITE_API_URL: JSON.stringify("https://psci-prod-api.herokuapp.com"),
      }

    return {
      ...config,
    }
  }
})
