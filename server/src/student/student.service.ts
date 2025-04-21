import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.schema';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private model: Model<Student>) {}

  async getByHallTicket(hallTicketNo: string) {
    const student = await this.model.findOne({ hallTicketNo }).lean();
    if (!student) throw new NotFoundException('Student not found');

    const passBySubject = student.maths >= 20 && student.physics >= 20 && student.chemistry >= 20;
    const overallPass = student.total >= 80 && passBySubject;
    const result = {
      ...student,
      pass: overallPass,
    };
    return result;
  }

  async seedDataIfEmpty() {
    const count = await this.model.countDocuments();
    if (count > 0) return;

    const { faker } = await import('@faker-js/faker');
    const students = Array.from({ length: 150000 }).map((_, i) => {
      const maths = faker.number.int({ min: 0, max: 70 });
      const physics = faker.number.int({ min: 0, max: 70 });
      const chemistry = faker.number.int({ min: 0, max: 70 });
      const total = maths + physics + chemistry;
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        hallTicketNo: `HT${String(i).padStart(6, '0')}`,
        maths,
        physics,
        chemistry,
        total,
        rank: faker.number.int({ min: 1, max: 150000 }),
      };
    });

    await this.model.insertMany(students);
  }
}
