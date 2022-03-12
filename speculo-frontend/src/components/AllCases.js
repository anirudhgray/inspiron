import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from '../axios.js';
import SidebarMechanism from './helper/SidebarMechanism.js';
import PageTitle from './helper/PageTitle.js';
import { Card, Title, Text, Button, Select } from '@mantine/core';
import { useMantineColorScheme, useMantineTheme, Table } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function AllCases() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [data, setData] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');

  const navigate = useNavigate();

  useEffect(async () => {
    try {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${localStorage.getItem('token')}`;
      const res = await axios.get('/courtcases');
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getDate = (dateString) => {
    let d = new Date(dateString);
    let day = dayjs(d);
    return day.format('HH:mm on DD/MM/YYYY');
  };

  const handleCaseClick = (id) => {
    navigate(`/cases/${id}`);
  };

  const getDuration = (closed, started) => {
    let closedTime = new Date(closed);
    const startedTime = new Date(started);
    if (closedTime - startedTime === 0) {
      closedTime = Date.now();
    }
    console.log(closedTime, startedTime);
    const milliSecondsPassed = closedTime - startedTime;
    const secondsPassed = Math.floor(milliSecondsPassed / 1000);
    const days = Math.floor(secondsPassed / 86400);
    const hours = Math.floor((secondsPassed % 86400) / 3600);
    const minutes = Math.floor(((secondsPassed % 86400) % 3600) / 60);
    return `${days} days, ${hours} hours and ${minutes} minutes`;
  };

  const courtcases = [];
  if (data) {
    for (let i = 0; i < data.length; i++) {
      courtcases.push(
        <tr
          style={{ cursor: 'pointer' }}
          onClick={() => handleCaseClick(data[i]._id)}
          key={data[i]._id}
        >
          <td>{data[i].title}</td>
          <td>{data[i].courtroom}</td>
          <td>{getDate(data[i].createdAt)}</td>
          <td>{data[i].closed ? 'Closed' : 'Ongoing'}</td>
          <td>{getDuration(data[i].updatedAt, data[i].createdAt)}</td>
        </tr>
      );
    }
  }

  const handleSubmit = () => {
    navigate(`/cases/${selectedCase}`);
  };

  return (
    <div className="grid h-full">
      <SidebarMechanism />
      <div className="lg:col-9 md:col-8 col-12">
        <PageTitle title="All Cases" />
        {data ? (
          <form
            onSubmit={handleSubmit}
            className="md:col-6 col-12 mx-auto mt-6 flex flex-column"
          >
            <Select
              placeholder="Search for a case by name"
              searchable
              value={selectedCase}
              onChange={setSelectedCase}
              nothingFound="No case found :("
              data={data.map(function (item) {
                return { value: item._id, label: item.title };
              })}
            ></Select>
            <Button
              type="submit"
              disabled={!selectedCase}
              className="mx-auto mt-2"
            >
              Go
            </Button>
          </form>
        ) : null}
        <Table
          striped
          highlightOnHover
          verticalSpacing="xl"
          horizontalSpacing="xl"
        >
          <thead>
            <tr>
              <th>Case Name</th>
              <th>Courtroom</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Running Time</th>
            </tr>
          </thead>
          <tbody>{courtcases}</tbody>
        </Table>
      </div>
    </div>
  );
}
