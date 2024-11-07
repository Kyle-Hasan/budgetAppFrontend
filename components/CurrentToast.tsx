import { AntDesign } from "@expo/vector-icons"
import { XStack, YStack } from "@tamagui/stacks"
import { Toast, useToastState } from "@tamagui/toast"

export default function CurrentToast() {
    const currentToast = useToastState()
    currentToast?.notificationOptions
    const color = currentToast?.customData?.color
    if (!currentToast || currentToast.isHandledNatively) return null
    return (
      <Toast
        key={currentToast.id}
        duration={currentToast.duration}
        enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
        exitStyle={{ opacity: 0, scale: 1, y: -20 }}
        y={0}
        opacity={1}
        scale={1}
        animation="100ms"
        viewportName={currentToast.viewportName}
        backgroundColor={color}
      >
        <YStack>
        <XStack alignItems="center" justifyContent="space-between">
            <Toast.Title>{currentToast.title}</Toast.Title>
            <Toast.Close  style={{
                backgroundColor: 'transparent',
                padding: 0, 
                border: 'none', 
                cursor: 'pointer', 
                marginLeft:1
              }}>
            <AntDesign name="closecircle" size={24} color="black" />
            </Toast.Close>
          </XStack>
        
          
          {!!currentToast.message && (
            <Toast.Description>{currentToast.message}</Toast.Description>
          )}
        </YStack>
      </Toast>
    )
  }
  