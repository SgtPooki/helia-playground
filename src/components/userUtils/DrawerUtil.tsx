import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, DrawerProps } from '@chakra-ui/react'
import React, { PropsWithChildren, useCallback } from 'react'

type FocusableElement = DrawerProps['finalFocusRef']

interface DrawerUtilProps {
  header: string
  actionText?: string
  onSubmit?: () => void
  onCleanup?: () => void
}

const noop = () => {}
export default function DrawerUtil({ actionText, header, onSubmit, onCleanup, children }: PropsWithChildren<DrawerUtilProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<FocusableElement>()

  const cleanup = useCallback(() => {
    onCleanup?.()
    onClose()
  }, [onClose, onCleanup])

  return (
    <>
    {/* @ts-expect-error */}
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        {header}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={cleanup}
        size={'xl'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{header}</DrawerHeader>
          <DrawerBody>
            {children}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={cleanup}>Cancel</Button>
            <Button colorScheme='blue' onClick={onSubmit ?? cleanup}>{actionText ?? 'Submit'}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
