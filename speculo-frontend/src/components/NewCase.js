import React, { useState, useEffect } from 'react';
import { Stepper, TextInput, Textarea, Button, Select } from '@mantine/core';
import SidebarMechanism from './helper/SidebarMechanism';
import PageTitle from './helper/PageTitle';
import axios from '../axios.js';

export default function NewCase() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [judge, setJudge] = useState('');
  const [defendant, setDefendant] = useState('');
  const [plaintiff, setPlaintiff] = useState('');
  const [defender, setDefender] = useState('');
  const [prosecutor, setProsecutor] = useState('');
  const [courtroom, setCourtroom] = useState('');

  const [users, setUsers] = useState([]);
  const [judges, setJudges] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  const [notJudge, setNotJudge] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(async () => {
    const res = await axios.get('/users');
    const data = res.data;
    setJudges(data.judges);
    setUsers(data.users);
    setLawyers(data.lawyers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courtCaseObj = {
      title,
      description,
      judge,
      defendant,
      plaintiff,
      defender,
      prosecutor,
      courtroom,
    };
    try {
      const res = await axios.post('/courtcases', courtCaseObj);
      setSuccess(true);
    } catch (e) {
      if (e.response.status === 404) {
        setNotJudge(true);
      }
      console.log(e);
    }
  };

  return (
    <div className="grid h-full">
      <SidebarMechanism />
      <div className="lg:col-9 md:col-8 col-12">
        <PageTitle title="Register New Case"></PageTitle>
        <div className="mt-6 px-4">
          <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step label="Fist step" description="Name and Details">
              <form className="flex flex-column mt-4" style={{ gap: '1rem' }}>
                <TextInput
                  value={title}
                  label="Case Name"
                  placeholder="Enter an identifiable name for the case"
                  className="md:col-6 col-12 mx-auto"
                  onChange={(e) => setTitle(e.currentTarget.value)}
                ></TextInput>
                <Textarea
                  value={description}
                  minRows={6}
                  label="Case Details/Overview"
                  placeholder="A brief overview of the case."
                  className="md:col-6 col-12 mx-auto"
                  onChange={(e) => setDescription(e.currentTarget.value)}
                ></Textarea>
                <Button
                  onClick={nextStep}
                  className="mx-auto"
                  color="green"
                  variant="filled"
                >
                  Next
                </Button>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Presiding Judge">
              <form className="flex flex-column mt-4" style={{ gap: '1rem' }}>
                <Select
                  label="Presiding Judge"
                  placeholder="Select the presiding judge"
                  searchable
                  value={judge}
                  onChange={setJudge}
                  className="md:col-6 col-12 mx-auto"
                  nothingFound="No judges found :("
                  data={judges.map(function (item) {
                    return { value: item._id, label: item.name };
                  })}
                ></Select>
                <TextInput
                  value={courtroom}
                  label="Courtroom"
                  placeholder="The designated courtroom for this case"
                  className="md:col-6 col-12 mx-auto"
                  onChange={(e) => setCourtroom(e.currentTarget.value)}
                ></TextInput>
                <div className="grid mx-auto" style={{ gap: '1rem' }}>
                  <Button
                    onClick={prevStep}
                    className="mx-auto"
                    color="green"
                    variant="filled"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="mx-auto"
                    color="green"
                    variant="filled"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Final step" description="Parties Involved">
              <form className="flex flex-column mt-4" style={{ gap: '1rem' }}>
                <Select
                  label="Defendant"
                  placeholder="Select the defendant"
                  searchable
                  value={defendant}
                  onChange={setDefendant}
                  className="md:col-6 col-12 mx-auto"
                  nothingFound="Nothing here :("
                  data={users.map(function (item) {
                    return { value: item._id, label: item.name };
                  })}
                ></Select>
                <Select
                  label="Plaintiff"
                  placeholder="Select the plaintiff"
                  searchable
                  value={plaintiff}
                  onChange={setPlaintiff}
                  className="md:col-6 col-12 mx-auto"
                  nothingFound="Nothing here :("
                  data={users.map(function (item) {
                    return { value: item._id, label: item.name };
                  })}
                ></Select>
                <Select
                  label="Defender"
                  placeholder="Select the defender"
                  searchable
                  value={defender}
                  onChange={setDefender}
                  className="md:col-6 col-12 mx-auto"
                  nothingFound="Nothing here :("
                  data={lawyers.map(function (item) {
                    return { value: item._id, label: item.name };
                  })}
                ></Select>
                <Select
                  label="Prosecutor"
                  placeholder="Select the prosecutor"
                  searchable
                  value={prosecutor}
                  onChange={setProsecutor}
                  className="md:col-6 col-12 mx-auto"
                  nothingFound="Nothing here :("
                  data={lawyers.map(function (item) {
                    return { value: item._id, label: item.name };
                  })}
                ></Select>
                <div className="grid mx-auto" style={{ gap: '1rem' }}>
                  <Button
                    onClick={prevStep}
                    className="mx-auto"
                    color="green"
                    variant="filled"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="mx-auto"
                    color="green"
                    variant="filled"
                  >
                    Finish
                  </Button>
                </div>
                {success ? (
                  <div>
                    Case Registered!
                    <Button onClick={() => setActive(0)} variant="subtle">
                      Register Another Case
                    </Button>
                  </div>
                ) : null}
              </form>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
}
