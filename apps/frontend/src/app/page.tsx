'use client';

import * as React from 'react';
import { DoctorAvailabilityCalendar } from '../components/doctor-availability-calendar';
import { DoctorAppointmentsReport } from './doctor-appointments-report';

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<'booking' | 'report'>('booking');

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === 'booking'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Book appointment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === 'report'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Doctor Appointments Report
          </button>
        </div>

        {activeTab === 'booking' ? <DoctorAvailabilityCalendar /> : <DoctorAppointmentsReport />}
      </div>
    </main>
  );
}
