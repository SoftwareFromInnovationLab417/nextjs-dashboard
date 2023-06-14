import '@styles/globals.scss'
import type { AppProps } from 'next/app'
// Next.js allows you to import CSS directly in .js files.
// It handles optimization and all the necessary Webpack configuration to make this work.
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { SSRProvider } from 'react-bootstrap'
import { ProgressBar } from '@components/ProgressBar'
import { useContext, useState } from 'react'
import React from 'react'
import { GlobalContext, initGlobalData } from 'src/globalData'

// You change this configuration value to false so that the Font Awesome core SVG library
// will not try and insert <style> elements into the <head> of the page.
// Next.js blocks this from happening anyway so you might as well not even try.
// See https://fontawesome.com/v6/docs/web/use-with/react/use-with#next-js
config.autoAddCss = false



function MyApp({ Component, pageProps }: AppProps) {
  const [globalData, setGlobalData] = useState(initGlobalData)
  return (
    <SSRProvider>
      <ProgressBar />
      <GlobalContext.Provider value={{ globalData, setGlobalData }}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </SSRProvider>
  )
}

export default MyApp
