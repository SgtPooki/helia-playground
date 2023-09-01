import React, { useState } from 'react';
import { useHelia } from '../hooks/useHelia.ts';
import {Heading} from '@chakra-ui/react'
//     <h1 id="status">Node status: <span id="statusValue">Not Started</span></h1>

export default function StatusText () {
  const {dhtMode, status} = useHelia();
  let dhtLabel: string = dhtMode
  if (dhtMode !== 'unknown') {
    dhtLabel = dhtMode === "client" ? "DHT Client" : "DHT Server"
  }
  return (
    <Heading id="status" as="h2" size="xl">Node status: <span>{status} - {dhtLabel}</span></Heading>
  )
}
