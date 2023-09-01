import React, { useState } from 'react';
import { useHelia } from '../hooks/useHelia.ts';

export default function EventLog () {
  const {events} = useHelia();

  return (
    <>
      <h2>Event Log:</h2>
      <article id="runningLog">
        {events.map((event, i) => (
          <div key={i}>{event}</div>
        ))}
      </article>
    </>
  )
}
