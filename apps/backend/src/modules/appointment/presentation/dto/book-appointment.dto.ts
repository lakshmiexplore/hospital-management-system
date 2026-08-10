import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  @IsString()
  patientEmail?: string;

  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;
}
