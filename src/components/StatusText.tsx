import React, { useCallback, useMemo, useState } from 'react';
import { useHelia } from '../hooks/useHelia.ts';
import {Button, Heading, Stack} from '@chakra-ui/react'
//     <h1 id="status">Node status: <span id="statusValue">Not Started</span></h1>

export default function StatusText () {
  const {dhtMode, status, helia, starting} = useHelia();
  let dhtLabel: string = dhtMode
  if (dhtMode !== 'unknown') {
    dhtLabel = dhtMode === "client" ? "DHT Client" : "DHT Server"
  }

  const startHelia = useCallback(async () => {
    if (helia == null) {
      return
    }
    await helia.start();
  }, [helia])

  const stopHelia = useCallback(async () => {
    if (helia == null) {
      return
    }
    await helia.stop();
  }, [helia])

  const ToggleButton = () => {
    if (starting === true) {
      return <>starting...</>
    }
    if (status !== 'Online') {
      return <Button onClick={startHelia} backgroundColor="green.200">Start Helia</Button>
    }
    return <Button onClick={stopHelia} backgroundColor="red.200">Stop Helia</Button>
  }

  return (
    <Stack direction="row">
      <Heading id="status" as="h2" size="xl">Node status: {status} - {dhtLabel}</Heading>
      <ToggleButton />
    </Stack>
  )
}
