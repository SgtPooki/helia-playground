import React, { useCallback, useMemo, useState } from 'react';
import { useHelia } from '../../hooks/useHelia.ts';
import { CID } from 'multiformats/cid'
import { Heading, Input, InputGroup, InputLeftAddon, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Box, List, ListItem } from '@chakra-ui/react'
import { CheckIcon, WarningTwoIcon } from '@chakra-ui/icons'
import DrawerUtil from './DrawerUtil.tsx';
import type { GetEvents } from '@helia/unixfs';

const defaultTimeoutValue = 5000
const textDecoder = new TextDecoder()

// See https://github.com/GoogleChromeLabs/jsbi/issues/30
const stringifyReplacer =
    BigInt.prototype.toJSON === undefined
        ? (_, v) => typeof v === 'bigint' ? v.toString() : v
        : undefined

/**
 * A collapsible section that displays the form for fetching content from IPFS.
 */
export default function FetchContent () {
  const { fs } = useHelia()
  const [timeout, setTimeout] = useState(defaultTimeoutValue)
  const [cid, setCid] = useState<CID|null>(null)
  const [utilLog, setUtilLog] = useState<string[]>([])
  const [logSummary, setLogSummary] = useState<Record<string, number>>({})

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
    setLogSummary((prev) => {
      let adjustedType = type
      // @ts-expect-error - TODO: fix this
      if (type.includes('kad-dht:query:query-error') && detail.error != null) {
        // @ts-expect-error - TODO: fix this
        adjustedType = `${type} ${detail.error.code}`
      }
      if (prev[adjustedType] == null) {
        prev[adjustedType] = 0
      }
      prev[adjustedType] += 1
      return prev
    })
    if (detail.toString() === '[object Object]') {
      setUtilLog((prev) => [...prev, `${progEvent.type}: ${JSON.stringify(progEvent.detail, stringifyReplacer)}`])
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
    setCid(null)
    setUtilLog(() => [])
  }, [])

  return (
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
        <Heading size="md">Log:</Heading>
        <List>
          {utilLog.map((event, i) => (
            <ListItem key={i}>{event}</ListItem>
          ))}
        </List>
        <Heading size="md">Summary:</Heading>
        <List>
          {Object.entries(logSummary).map(([type, count]) => (
            <ListItem key={type}>{type}: {count}</ListItem>
          ))}
        </List>
      </Box>
    </DrawerUtil>
  )
}
