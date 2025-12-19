import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Exam } from './admin/exams/exam.entity';
import { TestResult } from './tests/test-result.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test.db',
      entities: [User, Exam, TestResult],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    DictionariesModule,
    AdminModule,
    TestsModule,
  ],
})
export class AppModule {}
