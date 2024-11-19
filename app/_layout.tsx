import { Slot } from "expo-router"
import { AuthProvider } from "./context/AuthContext"
import { FormProvider } from "./context/FormContex"
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from '@tamagui/core'

import { tamaguiConfig } from '../tamagui.config'
import { DarkTheme, DefaultTheme,ThemeProvider } from "@react-navigation/native"
import { ToastProvider, ToastViewport } from "@tamagui/toast"
import React, { useEffect } from "react"
import { PortalProvider } from '@tamagui/portal';
import { useFonts } from 'expo-font'
import { StatusBar } from "expo-status-bar"
export default function Root() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded])

  if (!loaded) {
    return null
  }



  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <StatusBar style="light"></StatusBar>
       <PortalProvider>
      <ToastProvider>
     
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    
    <AuthProvider>
      <FormProvider>
        
          <Slot />
        
      </FormProvider>
    </AuthProvider>
    </ThemeProvider>
    </ToastProvider>
    </PortalProvider>
    </TamaguiProvider>
  )
}
