import React from 'react';
import { useHelia } from '../hooks/useHelia.ts';
import { Box, Heading, List, ListItem } from '@chakra-ui/react';

export default function EventLog () {
  const {events} = useHelia();

  return (
    <Box alignSelf="left">
      <Heading as="h2" size="xl">Event Log:</Heading>
      <List id="runningLog">
        {events.map((event, i) => (
          <ListItem key={i}>{event}</ListItem>
        ))}
      </List>
    </Box>
  )
}
