import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestResult } from '../../tests/test-result.entity';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestResult]), AuthModule],
  providers: [ResultsService],
  controllers: [ResultsController],
})
export class ResultsModule {}
