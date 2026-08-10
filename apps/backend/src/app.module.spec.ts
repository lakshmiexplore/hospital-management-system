import 'reflect-metadata';
import { AppModule } from './app.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { CalendarModule } from './modules/calendar/calendar.module';

describe('AppModule', () => {
  it('registers the appointment and calendar modules', () => {
    const importedModules = Reflect.getMetadata('imports', AppModule) ?? [];

    expect(importedModules).toEqual(
      expect.arrayContaining([AppointmentModule, CalendarModule]),
    );
  });
});
