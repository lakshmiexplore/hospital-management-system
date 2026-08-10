'use client';

import * as React from 'react';

type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

type AppointmentRow = {
  id: string;
  patientName: string;
  patientEmail: string;
  startsAt: string;
  endsAt: string;
  doctorName: string;
  doctorId: string;
  status: AppointmentStatus;
};

type DoctorOption = {
  id: string;
  name: string;
};

const ALL_DOCTORS = 'all-doctors';

export function DoctorAppointmentsReport() {
  const [selectedDoctorId, setSelectedDoctorId] = React.useState<string>(ALL_DOCTORS);
  const [appointments, setAppointments] = React.useState<AppointmentRow[]>([]);
  const [doctors, setDoctors] = React.useState<DoctorOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchAppointments = React.useCallback(async (doctorId?: string) => {
    setLoading(true);

    try {
      const url = doctorId && doctorId !== ALL_DOCTORS
        ? `http://localhost:4000/appointments?doctorId=${encodeURIComponent(doctorId)}`
        : 'http://localhost:4000/appointments';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Unable to load appointments');
      }

      const data = await response.json();
      const nextAppointments = data.map((item: any) => {
        const doctorName = item.doctorName || (item.doctor
          ? `${item.doctor.firstName} ${item.doctor.lastName}`.trim()
          : 'Unknown doctor');

        return {
          id: item.id,
          patientName: item.patientName ?? 'Unknown patient',
          patientEmail: item.patientEmail ?? 'N/A',
          startsAt: item.startsAt,
          endsAt: item.endsAt,
          doctorName,
          doctorId: item.doctorId ?? item.doctor?.id,
          status: item.status,
        };
      });

      setAppointments(nextAppointments);

      const doctorMap = new Map<string, DoctorOption>();
      nextAppointments.forEach((appointment) => {
        const displayName = appointment.doctorName?.trim() || 'Unknown doctor';
        doctorMap.set(appointment.doctorId, {
          id: appointment.doctorId,
          name: displayName,
        });
      });

      setDoctors([
        { id: ALL_DOCTORS, name: 'All doctors' },
        ...Array.from(doctorMap.values()),
      ]);
    } catch (error) {
      console.error(error);
      setAppointments([]);
      setDoctors([{ id: ALL_DOCTORS, name: 'All doctors' }]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAppointments(selectedDoctorId === ALL_DOCTORS ? undefined : selectedDoctorId);
  }, [fetchAppointments, selectedDoctorId]);

  const handleCancel = async (appointmentId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Unable to cancel appointment');
      }

      await fetchAppointments(selectedDoctorId === ALL_DOCTORS ? undefined : selectedDoctorId);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Overview</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Doctor Appointments Report</h2>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-sm font-medium text-slate-600">Doctor</span>
          <select
            value={selectedDoctorId}
            onChange={(event) => setSelectedDoctorId(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500"
          >
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Patient Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Date &amp; Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading appointments...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">{appointment.patientName}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{appointment.patientEmail}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatDateTime(appointment.startsAt)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{appointment.doctorName}</td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        appointment.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : appointment.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {appointment.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(appointment.id)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
