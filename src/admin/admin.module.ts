import { Module } from '@nestjs/common';
import { ExamsModule } from './exams/exams.module';
import { DictionariesModule } from '../dictionaries/dictionaries.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [ExamsModule, DictionariesModule
    // , ResultsModule
],
})
export class AdminModule {}
