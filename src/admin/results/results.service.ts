import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from '../../tests/test-result.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(TestResult)
    private testResultsRepository: Repository<TestResult>,
  ) {}

  async findAll(): Promise<TestResult[]> {
    return this.testResultsRepository.find({
      relations: ['exam', 'user'],
    });
  }

  async deleteResult(id: number): Promise<{ message: string; id: number }> {
    const result = await this.testResultsRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException(`Test result with ID ${id} not found`);
    }

    await this.testResultsRepository.remove(result);
    return { message: 'Test result deleted successfully', id };
  }
}
