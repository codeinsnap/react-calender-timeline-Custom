import './App.css'
import React, { useState } from 'react'
import './App.css';
import CalendarTimeline from './component/timeLine';
import CalendarTimeline02 from './component/timeLine2';
import { Tooltip } from 'react-tooltip'
import CalendarTimeline3 from './component/timeLine3';


function App() {

  const item = { itemData: {} }
  return (
    <div style={{ padding: "20px" }}>
      <CalendarTimeline />
    </div>
  );
}

export default App;