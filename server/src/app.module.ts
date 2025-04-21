import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { StudentService } from './student/student.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    StudentModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly studentService: StudentService) {}

  async onModuleInit() {
    await this.studentService.seedDataIfEmpty();
    console.log('Database seeded if it was empty.');
  }
}
