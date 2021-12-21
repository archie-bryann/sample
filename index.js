

import React, { useState, useEffect } from 'react';

import './index.scss';

import { PlusCircleFill, TrashFill } from 'react-bootstrap-icons';

import ReactSwitch from 'react-switch';

import useDoctorService from '../../../shared/hooks/api/useDoctorService';

import { useDoctorState } from '../../../shared/context/useDoctorContext';

import LoadingOverlay from 'react-loading-overlay';

import Swal from 'sweetalert2';

import queryString from 'query-string';

function index() {

  const { mutateAsync: setDoctorSchedule } = useDoctorService.useSetDoctorSchedule();

  const { mutateAsync: getDoctorSchedule } = useDoctorService.useGetDoctorSchedule();

  const { doctor } = useDoctorState();

  const [loading, setLoading] = useState(true);

  const [days, setDays] = useState([]);

  const { next } = queryString.parse(location.search);

  const rootDashboardUrl = 'http://localhost:3000/app/dashboard';

  const defaultSchedule = [

    {

      id: 1,

      name: 'Monday',

      toggle: false,

      schedules: [],

    },

    {

      id: 2,

      name: 'Tuesday',

      toggle: false,

      schedules: [],

    },

    {

      id: 3,

      name: 'Wednesday',

      toggle: false,

      schedules: [],

    },

    {

      id: 4,

      name: 'Thursday',

      toggle: false,

      schedules: [],

    },

    {

      id: 5,

      name: 'Friday',

      toggle: false,

      schedules: [],

    },

    {

      id: 6,

      name: 'Saturday',

      toggle: false,

      schedules: [],

    },

    {

      id: 7,

      name: 'Sunday',

      toggle: false,

      schedules: [],

    },

  ];

  const timeOptions = [

    '07:30 AM',

    '08:00 AM',

    '08:30 AM',

    '09:00 AM',

    '09:30 AM',

    '10:00 AM',

    '10:30 AM',

    '11:00 AM',

    '11:30 AM',

    '12:00 PM',

    '12:30 PM',

    '01:00 PM',

    '01:30 PM',

    '02:00 PM',

    '02:30 PM',

    '03:00 PM',

    '03:30 PM',

    '04:00 PM',

    '04:30 PM',

    '05:00 PM',

    '05:30 PM',

    '06:00 PM',

    '06:30 PM',

    '07:00 PM',

    '07:30 PM',

    '08:00 PM',

    '08:30 PM',

    '09:00 PM',

    '09:30 PM',

    '10:00 PM',

    '10:30 PM',

    '11:00 PM',

    '11:30 PM',

    '12:00 AM',

    '12:30 AM',

    '01:00 AM',

    '01:30 AM',

    '02:00 AM',

    '02:30 AM',

    '03:00 AM',

    '03:30 AM',

    '04:00 AM',

    '04:30 AM',

    '05:00 AM',

    '05:30 AM',

    '06:00 AM',

    '06:30 AM',

    '07:00 AM',

  ];

  const toggleDays = day_id => {

    const _days = [...days];

    const dayIndex = _days.findIndex(_day => _day.id == day_id);

    _days[dayIndex].toggle = !_days[dayIndex].toggle;

    setDays(_days);

  };

  const addNewSchedule = day_id => {

    const _days = [...days];

    const dayIndex = _days.findIndex(_day => _day.id == day_id);

    _days[dayIndex].schedules.push({

      id: _days[dayIndex].schedules.length + 1,

      startTime: '08:00 AM',

      endTime: '08:30 AM',

    });

    setDays(_days);

  };

  const handleSelectChange = (event, day_id, schedule_id, scheduleType) => {

    const valueToBeSaved = event.target.value;

    const _days = [...days];

    const daysIndex = _days.findIndex(_day => _day.id == day_id);

    // check against duplicates

    const findScheduleTypeIndex = _days[daysIndex].schedules.findIndex(

      _schedule => _schedule[scheduleType] == valueToBeSaved,

    );

    if (findScheduleTypeIndex > -1) {

      Swal.fire('Seems like this schedule already exists!', '', 'info');

    } else {

      const scheduleIndex = _days[daysIndex].schedules.findIndex(

        _schedule => _schedule.id == schedule_id,

      );

      _days[daysIndex].schedules[scheduleIndex][scheduleType] = valueToBeSaved;

      setDays(_days);

    }

  };

  const deleteNewSchedule = (day_id, schedule_id) => {

    const _days = [...days];

    const dayIndex = _days.findIndex(_day => _day.id == day_id);

    const scheduleIndex = _days[dayIndex].schedules.findIndex(

      _schedule => _schedule.id == schedule_id,

    );

    _days[dayIndex].schedules.splice(scheduleIndex, 1);

    setDays(_days);

  };

  async function saveSchedule() {

    setLoading(true);

    const save = await setDoctorSchedule({ id: doctor.doctor.id, payload: { data: days } });

    console.log('save=>', save);

    setLoading(false);

    next ? (window.location.href = rootDashboardUrl) : () => {};

  }

  useEffect(() => {

    async function getSchedule() {

      const get = await getDoctorSchedule(doctor.doctor.id);

      console.log('get=>', get);

      setLoading(false);

      setDays(get?.schedule_data?.data.length > 0 ? get.schedule_data.data : defaultSchedule);

    }

    getSchedule();

  }, []);

  return (

    <main>

      <div className="main__container">

        <h3>Settings</h3>

        <br />

        <div className="row">

          <div className="col-12">

            <LoadingOverlay active={loading} spinner text="Please wait...">

              <div className="container set_schedule">

                <h3>Set Appointments Schedule</h3>

                <button className="btn btn-success" onClick={saveSchedule}>

                  Save

                </button>

                <hr />

                {days.map((day, i) => (

                  <div className="date" key={i}>

                    <div className="row">

                      <ReactSwitch

                        onChange={() => toggleDays(day.id)}

                        checked={day.toggle}

                        size={12}

                        className="toggle"

                      />

                      <span className="day">{day.name}</span>

                    </div>

                    {day.schedules.map(schedule => (

                      <div className="row">

                        <div className="col-4">

                          <div className="formGroup">

                            <select

                              name="startTime"

                              value={schedule.startTime}

                              className="inputField"

                              onChange={event =>

                                handleSelectChange(event, day.id, schedule.id, 'startTime')

                              }

                            >

                              {timeOptions.map((time, i) => (

                                <option key={i} value={time}>

                                  {time}

                                </option>

                              ))}

                            </select>

                          </div>

                        </div>

                        <div className="col-4">

                          <div className="formGroup">

                            <select

                              name="endTime"

                              value={schedule.endTime}

                              className="inputField"

                              onChange={event =>

                                handleSelectChange(event, day.id, schedule.id, 'endTime')

                              }

                            >

                              {timeOptions.map((time, i) => (

                                <option key={i} value={time}>

                                  {time}

                                </option>

                              ))}

                            </select>

                          </div>

                        </div>

                        <div className="col-4">

                          <div style={{ margin: '30px 0' }}>

                            <TrashFill

                              size={22}

                              color="danger"

                              onClick={() => deleteNewSchedule(day.id, schedule.id)}

                            />

                          </div>

                        </div>

                      </div>

                    ))}

                    <div className="row newTimeDiv" onClick={() => addNewSchedule(day.id)}>

                      <PlusCircleFill size={22} />

                      <span className="new-time">Add new time</span>

                    </div>

                    <hr />

                  </div>

                ))}

              </div>

            </LoadingOverlay>

          </div>

        </div>

      </div>

    </main>

  );

}

export default index;

