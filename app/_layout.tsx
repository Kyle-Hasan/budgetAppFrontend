import { Slot } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { FormProvider } from "./context/FormContex";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <AuthProvider>
      <FormProvider>
      <Slot />
      </FormProvider>
    </AuthProvider>
    
  );
}
