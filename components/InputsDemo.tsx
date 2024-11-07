import type { SizeTokens } from '@tamagui/core'
import { Input, TextArea,} from '@tamagui/input'
import {Button} from '@tamagui/button'
import { YStack,XStack } from '@tamagui/stacks'
export function InputsDemo() {
 
  return (
    <YStack
      width={200}
      minHeight={250}
      overflow="hidden"
      space="$2"
      margin="$3"
      padding="$2"
    >
      <InputDemo size="$2" />
      <InputDemo size="$3" />
      <InputDemo size="$4" />
      <TextArea placeholder="Enter your details..." />
    </YStack>
  )
}

function InputDemo(props: { size: SizeTokens }) {
    const onChangeText = (e:any)=> {
        console.log(e)
      }
  return (
    <XStack alignItems="center" space="$2">
      <Input onChange={onChangeText} onChangeText={onChangeText} flex={1} size={props.size} placeholder={`Size ${props.size}...`} />
      <Button size={props.size}>Go</Button>
    </XStack>
  )
}