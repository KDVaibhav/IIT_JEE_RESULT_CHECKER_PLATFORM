import { Controller, Get, Param } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('api/result')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get(':hallticket')
  async getResult(@Param('hallticket') hallTicket: string) {
    return this.service.getByHallTicket(hallTicket);
  }
}
