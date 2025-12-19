import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '../admin/exams/exam.entity';
import { TestResult } from './test-result.entity';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, TestResult]), AuthModule],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
