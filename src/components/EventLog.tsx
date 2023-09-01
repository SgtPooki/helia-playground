import React, { useState } from 'react';
import { useHelia } from '../hooks/useHelia.ts';

//     <h1 id="status">Node status: <span id="statusValue">Not Started</span></h1>

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
