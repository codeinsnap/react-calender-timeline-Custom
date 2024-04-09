import React from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { response } from './contanst'
import { Tooltip } from 'react-tooltip'


const CalendarTimeline = () => {


    const { PlannedData, ShiftDetails } = response;

    const { shiftTime, breaks } = ShiftDetails;

    const shiftStart = new Date(`1970-01-01T${shiftTime.start}`);
    const shiftEnd = new Date(`1970-01-01T${shiftTime.end}`);

    const breakTimes = breaks.map((breakItem) => ({
        start: new Date(`1970-01-01T${breakItem.breakStart}`),
        end: new Date(`1970-01-01T${breakItem.breakEnd}`),
    }));

    // Generate timeline items
    const timelineItems = PlannedData.map((item) => {
        const start = new Date(`1970-01-01T${item.planned_start_time}`);
        const end = new Date(`1970-01-01T${item.planned_end_time}`);

        // Determine item color based on whether it's within shift or break times
        let color = 'white'; // Default color for items outside of shift/break times
        if (start >= shiftStart && end <= shiftEnd) {
            color = 'orange'; // Orange color for items within shift times
        } else {
            for (const breakTime of breakTimes) {
                if (start >= breakTime.start && end <= breakTime.end) {
                    color = 'gray'; // Gray color for items within break times
                    break; // Stop checking breaks if item found within break
                }
            }
        }

        return {
            id: item.serial_no,
            group: item.stall,
            title: item.serial_no,
            start_time: start,
            end_time: end,
            itemProps: {
                style: { backgroundColor: color },
            },
            itemData: item,
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
                maxZoom={1000*60*60*3}
                sidebarContent={<div>Shop: {response.shopDetail.description}</div>}
                itemRenderer={

                    ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
                        const { vin, planned_start_time, planned_end_time, std_install_time, model_year, model_type } = item.customProps;
                        const start = new Date(`1970-01-01T${planned_start_time}`);
                        const end = new Date(`1970-01-01T${planned_end_time}`);

                        // console.log({...getItemProps()})

                        const temp = { ...getItemProps() }
                        let color = 'white'; // Default color for items outside of shift/break times
                        if (item.start_time >= shiftStart) {
                            color = 'orange';
                            for (const breakTime of breakTimes) {
                                if (item.start_time >= breakTime.start && item.start_time <= breakTime.end) {
                                    color = 'gray'; // Gray color for items within break times
                                    // Stop checking breaks if item found within break
                                }
                                else if (item.end_time >= breakTime.start && item.end_time <= breakTime.end) {
                                    color = 'gray'; // Gray color for items within break times
                                    // Stop checking breaks if item found within break
                                }
                                else if (item.start_time <= breakTime.start && item.end_time >= breakTime.end) {
                                    color = 'gray'; // Gray color for items within break times
                                    // Stop checking breaks if item found within break
                                }
                            }
                        }


                        temp.style = { ...temp.style, background: color, borderColor: 'black' }
                        return (
                            <>
                                <div  {...temp}>
                                    <div id={`tooltip-${item.id}`} style={{ fontSize: "9px" }}>
                                        {item.title}
                                    </div>
                                </div>
                                <div style={{ zIndex: 9999 }} >
                                    <Tooltip style={{ zIndex: 999, padding: '5px 5px', margin: "2px 2px", position: 'fixed' }} anchorSelect={`#tooltip-${item.id}`} place="bottom">
                                        <div style={{ fontSize: "6px" }}>VIN: {item?.itemData?.vin ?? ''}</div>
                                        <div style={{ fontSize: "6px" }}>Planned Start Time: {item?.itemData?.planned_start_time ?? ''}</div>
                                        <div style={{ fontSize: "6px" }}>Planned End Time: {item?.itemData?.planned_end_time ?? ''}</div>
                                        <div style={{ fontSize: "6px" }}>Std Install Time: {item?.itemData?.std_install_time ?? ''}</div>
                                        <div style={{ fontSize: "6px" }}>Model Year: {item?.itemData?.model_year ?? ''}</div>
                                        <div style={{ fontSize: "6px" }}>Model Type: {item?.itemData?.model_type ?? ''}</div>
                                    </Tooltip>
                                </div>
                            </>
                        );
                    }}
            />
        </div>
    );
};

export default CalendarTimeline;
