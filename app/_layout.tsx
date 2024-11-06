import { Slot } from "expo-router"
import { AuthProvider } from "./context/AuthContext"
import { FormProvider } from "./context/FormContex"
export default function Root() {
  return (
    <AuthProvider>
      <FormProvider>
        
          <Slot />
        
      </FormProvider>
    </AuthProvider>
  )
}
