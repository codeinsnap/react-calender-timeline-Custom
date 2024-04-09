import React from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { response } from './contanst';

const CalendarTimeline3 = () => {
    const data = response.data
  // Extract necessary data
  const { PlannedData, ShiftDetails } = data;
  const { shiftTime, breaks } = ShiftDetails;

  // Parse shift start and end times
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().slice(0, 10); // Get current date string in 'YYYY-MM-DD' format
  const shiftStart = new Date(`${currentDateString}T${shiftTime.start}`);
  const shiftEnd = new Date(`${currentDateString}T${shiftTime.end}`);

  // Parse break times
  const breakTimes = breaks.map((breakItem) => ({
    start: new Date(`${currentDateString}T${breakItem.breakStart}`),
    end: new Date(`${currentDateString}T${breakItem.breakEnd}`),
  }));

  // Generate timeline items
  const timelineItems = PlannedData.map((item) => {
    const start = new Date(`${currentDateString}T${item.planned_start_time}`);
    const end = new Date(`${currentDateString}T${item.planned_end_time}`);

    return {
      id: item.serial_no,
      group: item.stall,
      title: item.vin,
      start_time: start,
      end_time: end,
      itemProps: {
        style: { backgroundColor: 'orange' },
      },
      customProps: {
        vin: item.vin,
        planned_start_time: item.planned_start_time,
        planned_end_time: item.planned_end_time,
        std_install_time: item.std_install_time,
        model_year: item.model_year,
        model_type: item.model_type
      }
    };
  });

  // Generate groups
  const groups = [...new Set(PlannedData.map((item) => item.stall))].map((stall) => ({
    id: stall,
    title: `Stall ${stall}`,
  }));

  // Function to show details on hover
  const showDetails = (item) => (
    <div style={{ background: 'black', color: 'white', padding: '10px' }}>
      <div>VIN: {item.vin}</div>
      <div>Planned Start Time: {item.planned_start_time}</div>
      <div>Planned End Time: {item.planned_end_time}</div>
      <div>Std Install Time: {item.std_install_time}</div>
      <div>Model Year: {item.model_year}</div>
      <div>Model Type: {item.model_type}</div>
    </div>
  );

  return (
    <div>
      <Timeline
        groups={groups}
        items={timelineItems}
        defaultTimeStart={shiftStart}
        defaultTimeEnd={shiftEnd}
        sidebarContent={<div>Shop: {data.shopDetail.description}</div>}
        itemRenderer={({ item, timelineContext, itemContext }) => {
          
          return (
            <div
              onMouseEnter={() => itemContext.setIsHovered(true)}
              onMouseLeave={() => itemContext.setIsHovered(false)}
            >
              {itemContext.useResizeHandle ? <div {...timelineContext.resizeProps} /> : null}
              <div {...item.itemProps} style={{ background: 'orange', borderRadius: '3px', padding: '2px' }}>
                {item.title}
              </div>
              {itemContext.showTooltip && (
                <div style={{ position: 'absolute', zIndex: 1000, left: itemContext.dimensions.left, top: itemContext.dimensions.top + itemContext.dimensions.height }}>
                  {showDetails(item.customProps)}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CalendarTimeline3;
