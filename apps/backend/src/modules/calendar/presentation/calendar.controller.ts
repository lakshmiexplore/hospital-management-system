import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

class DoctorAvailabilityQueryDto {
  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @IsString()
  @IsNotEmpty()
  startsAt!: string;

  @IsString()
  @IsNotEmpty()
  endsAt!: string;
}

@Controller('calendar')
export class CalendarController {
  @Get('availability')
  getAvailability(@Query() query: DoctorAvailabilityQueryDto) {
    const startsAt = new Date(query.startsAt);
    const endsAt = new Date(query.endsAt);

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException('Invalid date range');
    }

    return {
      doctorId: query.doctorId,
      available: true,
      startsAt,
      endsAt,
    };
  }
}
