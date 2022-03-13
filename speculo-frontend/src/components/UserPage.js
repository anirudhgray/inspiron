import React, { useEffect, useState } from 'react';
import SidebarMechanism from './helper/SidebarMechanism';
import axios from '../axios.js';
import PageTitle from './helper/PageTitle';
import { Card, Title, Text, Button, Table } from '@mantine/core';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function UserPage() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [data, setData] = useState(false);

  const getDate = (dateString) => {
    let d = new Date(dateString);
    let day = dayjs(d);
    return day.format('HH:mm on DD/MM/YYYY');
  };

  const navigate = useNavigate();

  useEffect(async () => {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('token')}`;
    const res = await axios.get('/users/me');
    setData(res.data);
  }, []);

  const handleCaseClick = (id) => {
    navigate(`/cases/${id}`);
  };

  const updates = [];
  if (data) {
    const n_cases = data.casesOfInterest.length;
    for (let i = 0; i < n_cases; i++) {
      const caseName = data.casesOfInterest[i].title;
      const caseID = data.casesOfInterest[i]._id;
      const n_case_updates = data.casesOfInterest[i].courtUpdates.length;
      for (let j = n_case_updates - 1; j >= 0; j--) {
        updates.push(
          <tr
            style={{ cursor: 'pointer' }}
            onClick={() => handleCaseClick(caseID)}
            key={data.casesOfInterest[i].courtUpdates[j]._id}
          >
            <td>{caseName}</td>
            <td>{data.casesOfInterest[i].courtUpdates[j].content}</td>
            <td>
              {getDate(data.casesOfInterest[i].courtUpdates[j].createdAt)}
            </td>
          </tr>
        );
      }
    }
  }

  return (
    <div className="grid h-full">
      <SidebarMechanism />
      <div className="lg:col-9 md:col-8 col-12">
        <PageTitle title="Profile"></PageTitle>
        <Text className="mt-4 text-xl">{data.name}</Text>
        <Text className="text-lg">{data.userType}</Text>
        <div className="flex flex-column mt-6" style={{ gap: '1.5rem' }}>
          <Title order={3}>Updates For You</Title>
          <Table
            striped
            highlightOnHover
            verticalSpacing="xl"
            horizontalSpacing="xl"
          >
            <thead>
              <tr>
                <th>Case Name</th>
                <th>Update</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>{updates}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
