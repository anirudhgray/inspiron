import React, { useState } from 'react';
import { useEffect } from 'react';
import { Title, Card, Text, Button, Textarea, Checkbox } from '@mantine/core';
import axios from '../axios.js';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';

import SidebarMechanism from './helper/SidebarMechanism.js';
import PageTitle from './helper/PageTitle.js';

// mini avatars of all interested

export default function CasePage() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [data, setData] = useState(false);
  const [updates, setUpdates] = useState(false);
  const { id } = useParams();
  const [content, setContent] = useState('');

  const [closed, setClosed] = useState(true);
  const [trigger, setTrigger] = useState(false);

  const navigate = useNavigate();

  useEffect(async () => {
    try {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${localStorage.getItem('token')}`;
      const res = await axios.get(`/courtcases/${id}`);
      setData(res.data);
      setClosed(res.data.closed);
    } catch (e) {
      console.log(e);
      if ((e.response.status = 404)) {
        navigate('/404');
      }
    }
  }, [trigger]);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/courtcases/${id}/updates`, {
        content,
      });
      setContent('');
      const res = await axios.get(`/courtcases/updates?courtcase=${id}`);
      setUpdates(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCaseStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/courtcases/${id}`, { closed });
      setTrigger([]);
    } catch (e) {
      console.log(e);
    }
  };

  const getDate = (dateString) => {
    let d = new Date(dateString);
    let day = dayjs(d);
    return day.format('HH:mm on DD/MM/YYYY');
  };

  useEffect(async () => {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('token')}`;
    const res = await axios.get(`/courtcases/updates?courtcase=${id}`);
    setUpdates(res.data);
  }, []);

  const updateElems = [];
  if (data) {
    const n_updates = updates.length;
    for (let i = 0; i < n_updates; i++) {
      const content = updates[i].content;
      const time = updates[i].createdAt;
      updateElems.push(
        <Card
          style={{
            background:
              colorScheme === 'dark' ? `#343e2c` : theme.colors.gray[3],
          }}
        >
          <Text>{content}</Text>
          <Text>at {getDate(time)}</Text>
        </Card>
      );
    }
  }

  return (
    <div className="grid h-full">
      <SidebarMechanism />
      {data ? (
        <div className="lg:col-9 md:col-8 col-12">
          <PageTitle title="Court Case" subtitle={data.title}></PageTitle>
          <Text className="mt-4">{data.description}</Text>
          <div className="my-4 grid w-full justify-content-center">
            <div style={{ minWidth: '250px' }} className="col-6 p-2">
              <Card shadow="lg">
                <Text>Judge</Text>
                <Title order={3}>{data.judge.name}</Title>
              </Card>
            </div>
          </div>
          <div className="my-4 grid w-full flex-wrap justify-content-center">
            <div style={{ minWidth: '250px' }} className="col-6 p-2">
              <Card shadow="lg">
                <Text>Defendant</Text>
                <Title order={3}>{data.defendant.name}</Title>
              </Card>
            </div>
            <div style={{ minWidth: '250px' }} className="col-6 p-2">
              <Card shadow="lg">
                <Text>Defender</Text>
                <Title order={3}>{data.defender.name}</Title>
              </Card>
            </div>
            <div style={{ minWidth: '250px' }} className="col-6 p-2">
              <Card shadow="lg">
                <Text>Plaintiff</Text>
                <Title order={3}>{data.plaintiff.name}</Title>
              </Card>
            </div>
            <div style={{ minWidth: '250px' }} className="col-6 p-2">
              <Card shadow="lg">
                <Text>Prosecutor</Text>
                <Title order={3}>{data.prosecutor.name}</Title>
              </Card>
            </div>
          </div>
          <div className="flex flex-column mt-6" style={{ gap: '1.5rem' }}>
            {localStorage.getItem('userType') === 'Judge' && !data.closed ? (
              <form onSubmit={handleCaseStatus}>
                <Text>Status: Ongoing</Text>
                <Checkbox
                  checked={closed}
                  onChange={(e) => setClosed(e.currentTarget.checked)}
                  label="Mark case as closed (only you, as the judge can do this)."
                ></Checkbox>
                <Button type="submit" color="green" variant="subtle">
                  Mark Case
                </Button>
              </form>
            ) : null}
            {localStorage.getItem('userType') === 'Judge' && data.closed ? (
              <form onSubmit={handleCaseStatus}>
                <Text>Status: Closed</Text>
                <Checkbox
                  checked={!closed}
                  onChange={(e) => setClosed(!e.currentTarget.checked)}
                  label="Reopen case (only you, as the judge can do this)."
                ></Checkbox>
                <Button type="submit" color="green" variant="subtle">
                  Mark Case
                </Button>
              </form>
            ) : null}
            <Title order={3}>Case Updates</Title>
            {localStorage.getItem('_id') === data.judge._id && !data.closed ? (
              <form
                className="flex flex-column align-items-center"
                style={{ gap: '1rem' }}
                onSubmit={handlePublish}
              >
                <Textarea
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.currentTarget.value)}
                  placeholder="Publish a general update about the case."
                  className="md:w-6"
                ></Textarea>
                <Button variant="filled" type="submit" color="green">
                  Publish Update
                </Button>
              </form>
            ) : null}
            {updateElems}
          </div>
        </div>
      ) : null}
    </div>
  );
}
