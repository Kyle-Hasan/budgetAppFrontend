import { Slot } from "expo-router"
import { AuthProvider } from "./context/AuthContext"
import { FormProvider } from "./context/FormContex"
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from '@tamagui/core'

import { tamaguiConfig } from '../tamagui.config'
import { DarkTheme, DefaultTheme,ThemeProvider } from "@react-navigation/native"
import { ToastProvider, ToastViewport } from "@tamagui/toast"
import React from "react"
import { PortalProvider } from '@tamagui/portal';
export default function Root() {
  const colorScheme = useColorScheme()
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
       <PortalProvider>
      <ToastProvider>
      <ToastViewport flexDirection="column" top={50} left={0} right={0} />
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
