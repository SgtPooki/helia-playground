import React, { useCallback, useState } from 'react';
import { useHelia } from '../../hooks/useHelia.ts';
import { CID } from 'multiformats/cid'
import { Button, useDisclosure, Input, InputGroup, InputLeftAddon, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Box, List, ListItem } from '@chakra-ui/react'
import { CheckIcon, WarningTwoIcon } from '@chakra-ui/icons'
import DrawerUtil from './DrawerUtil.tsx';
import type { GetEvents } from '@helia/unixfs';
// import { ChakraProvider } from '@chakra-ui/react'

// async function catFile () {
//   const textDecoder = new TextDecoder()
//   for await (const data of heliaFs.cat('bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')) {
//     console.log(textDecoder.decode(data))
//   }
// }

const defaultTimeoutValue = 5000
const textDecoder = new TextDecoder()
/**
 * A collapsible section that displays the form for fetching content from IPFS.
 */
export default function FetchContent () {
  const { fs } = useHelia()
  const [timeout, setTimeout] = useState(defaultTimeoutValue)
  const [cid, setCid] = useState<CID|null>(null)
  const [utilLog, setUtilLog] = useState<string[]>([])

  const setValidCid = useCallback(async (e) => {
    try {
      const cid = CID.parse(e.target.value)
      setCid(cid)
    } catch {
      setCid(null)
    }
  }, [])

  const onProgress = useCallback((progEvent: GetEvents) => {
    console.log(progEvent)
    const { type, detail } = progEvent
    if (detail.toString() === '[object Object]') {
      setUtilLog((prev) => [...prev, `${progEvent.type}: ${JSON.stringify(progEvent.detail)}`])
      return
    }
    setUtilLog((prev) => [...prev, `${progEvent.type}: ${progEvent.detail}`])
  }, [])

  const getContent = useCallback(async () => {
    if (fs == null || cid == null) {
      return
    }
    setUtilLog(() => [])
    try {
      for await (const data of fs.cat(cid, { signal: AbortSignal.timeout(timeout), onProgress })) {
        console.log(textDecoder.decode(data))
      }
    } catch (e) {
      console.error(e)
      // @ts-expect-error
      setUtilLog((prev) => [...prev, `${e.name}: ${e.message}`])
    }

  }, [cid, fs, timeout])


  const onCleanup = useCallback(() => {
    console.log('cleaning up')
    setCid(null)
    setUtilLog(() => [])
  }, [])

  return (
    // <ChakraProvider>
        <DrawerUtil header="Fetch Content" onSubmit={getContent} onCleanup={onCleanup}>
          <Text>This utility will help you fetch content using Helia. Enter a CID and select a timeout value.</Text>
          <Text>If you close this window, the log and CID entered will be cleared.</Text>
          <InputGroup width="50vw">
            <InputLeftAddon children="CID: " />
            <Input type="text" size="md" placeholder="bafy..." onChange={setValidCid} />
            <InputRightElement>
              { cid != null ? <CheckIcon color='green.500' /> : <WarningTwoIcon color='red.500' /> }
            </InputRightElement>
          </InputGroup>
          <InputGroup width="50vw">
            <InputLeftAddon children="Timeout(ms): " />
            {/* <Input type="number" size="md" placeholder="1000"  /> */}
            <NumberInput step={1000} defaultValue={defaultTimeoutValue} onChange={(valueString) => setTimeout(Number(valueString))} min={0}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
          <Box>
            <Text>Log:</Text>
            <List>
              {utilLog.map((event, i) => (
                <ListItem key={i}>{event}</ListItem>
              ))}
            </List>
          </Box>
        </DrawerUtil>
  )
}
