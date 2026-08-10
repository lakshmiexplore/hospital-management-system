'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

type Department = 'Cardiology' | 'Dermatology' | 'Orthopedics' | 'Neurology';

type Doctor = {
  id: string;
  name: string;
  department: Department;
  specialty: string;
  availableSlots: { id: string; time: string; day: string }[];
};

const departments: Department[] = ['Cardiology', 'Dermatology', 'Orthopedics', 'Neurology'];

const dayNameToIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const buildSlotDate = (slotDay: string) => {
  const [dayName, dayNumberText] = slotDay.split(' ');
  const dayOfMonth = Number(dayNumberText);
  const now = new Date();
  const candidate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
  const targetDayIndex = dayNameToIndex[dayName] ?? candidate.getDay();
  const offset = (targetDayIndex - candidate.getDay() + 7) % 7;
  candidate.setDate(candidate.getDate() + offset);
  return candidate;
};

const buildDateTimeFromSlot = (slotDay: string, slotTime: string) => {
  const date = buildSlotDate(slotDay);
  const timeMatch = slotTime.match(/(\d+):(\d+)\s*(AM|PM)/i);

  if (!timeMatch) {
    throw new Error('Selected slot time is invalid');
  }

  const [, hourText, minuteText, meridiem] = timeMatch;
  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (meridiem.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  }

  if (meridiem.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
};

const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Patel',
    department: 'Cardiology',
    specialty: 'Interventional Cardiology',
    availableSlots: [
      { id: 'slot-1', time: '9:00 AM', day: 'Mon 12' },
      { id: 'slot-2', time: '11:30 AM', day: 'Mon 12' },
      { id: 'slot-3', time: '2:00 PM', day: 'Tue 13' },
    ],
  },
  {
    id: 'doc-2',
    name: 'Dr. Elena Brown',
    department: 'Dermatology',
    specialty: 'Skin Care Specialist',
    availableSlots: [
      { id: 'slot-4', time: '10:00 AM', day: 'Tue 13' },
      { id: 'slot-5', time: '1:00 PM', day: 'Wed 14' },
    ],
  },
  {
    id: 'doc-3',
    name: 'Dr. Michael James',
    department: 'Orthopedics',
    specialty: 'Joint Health',
    availableSlots: [
      { id: 'slot-6', time: '8:30 AM', day: 'Wed 14' },
      { id: 'slot-7', time: '12:00 PM', day: 'Thu 15' },
      { id: 'slot-8', time: '4:00 PM', day: 'Thu 15' },
    ],
  },
  {
    id: 'doc-4',
    name: 'Dr. Olivia Chen',
    department: 'Neurology',
    specialty: 'Neurological Conditions',
    availableSlots: [
      { id: 'slot-9', time: '9:30 AM', day: 'Fri 16' },
      { id: 'slot-10', time: '3:30 PM', day: 'Fri 16' },
    ],
  },
];

export function DoctorAvailabilityCalendar() {
  const [selectedDepartment, setSelectedDepartment] = React.useState<Department>('Cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = React.useState<string>('doc-1');
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>('slot-1');
  const [patientName, setPatientName] = React.useState('');
  const [patientEmail, setPatientEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const filteredDoctors = React.useMemo(
    () => doctors.filter((doctor) => doctor.department === selectedDepartment),
    [selectedDepartment],
  );

  const selectedDoctor =
    filteredDoctors.find((doctor) => doctor.id === selectedDoctorId) ?? filteredDoctors[0] ?? doctors[0];

  const slotOptions = selectedDoctor?.availableSlots ?? [];

  React.useEffect(() => {
    if (!filteredDoctors.some((doctor) => doctor.id === selectedDoctorId)) {
      setSelectedDoctorId(filteredDoctors[0]?.id ?? doctors[0].id);
    }
  }, [filteredDoctors, selectedDoctorId]);

  React.useEffect(() => {
    if (!slotOptions.some((slot) => slot.id === selectedSlotId) && slotOptions[0]) {
      setSelectedSlotId(slotOptions[0].id);
    }
  }, [slotOptions, selectedSlotId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const selectedSlot = slotOptions.find((slot) => slot.id === selectedSlotId);
    if (!selectedSlot || !selectedDoctor) {
      return;
    }

    try {
      const startsAt = buildDateTimeFromSlot(selectedSlot.day, selectedSlot.time);
      const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);

      const response = await fetch('http://localhost:4000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: `patient-${Date.now()}`,
          patientName: patientName.trim(),
          patientEmail: patientEmail.trim(),
          doctorId: selectedDoctor.id,
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Unable to book appointment.');
      }

      setSubmitted(true);
      setFeedback({
        type: 'success',
        message: `Appointment booked successfully with ${selectedDoctor.name} on ${selectedSlot.day} at ${selectedSlot.time}.`,
      });
      setPatientName('');
      setPatientEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to book appointment.';
      setSubmitted(false);
      setFeedback({
        type: 'error',
        message: `Booking failed: ${message}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Hospital booking</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Doctor Availability & Appointment Booking</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Select department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-3">
                {departments.map((department) => (
                  <Button
                    key={department}
                    type="button"
                    variant={selectedDepartment === department ? 'default' : 'outline'}
                    onClick={() => setSelectedDepartment(department)}
                    className="rounded-full"
                  >
                    {department}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedDoctorId === doctor.id
                        ? 'border-sky-500 bg-sky-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{doctor.name}</p>
                        <p className="text-sm text-slate-500">{doctor.specialty}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Available
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Selected doctor</p>
                <p className="mt-1 text-xl font-semibold">{selectedDoctor.name}</p>
                <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {slotOptions.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      selectedSlotId === slot.id
                        ? 'border-sky-500 bg-sky-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{slot.day}</div>
                    <div className="mt-1 text-lg font-semibold">{slot.time}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Booking information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Patient name</label>
                <Input
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={patientEmail}
                  onChange={(event) => setPatientEmail(event.target.value)}
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Selected appointment</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {selectedDoctor.name} · {selectedDoctor.department} · {' '}
                  {slotOptions.find((slot) => slot.id === selectedSlotId)?.day ?? 'Select a slot'} · {' '}
                  {slotOptions.find((slot) => slot.id === selectedSlotId)?.time ?? 'No slot selected'}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div className="text-sm text-slate-500">
                  {submitted ? 'Appointment request submitted successfully.' : 'Please confirm your appointment details.'}
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Book appointment
                </Button>
              </div>

              {feedback.type && (
                <div
                  className={`md:col-span-2 rounded-lg border px-4 py-3 text-sm ${
                    feedback.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
