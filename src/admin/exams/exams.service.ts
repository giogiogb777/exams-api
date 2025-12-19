import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam, IQuestion } from './exam.entity';
import { QuestionCategoryEnum } from '../../dictionaries/dictionaries.service';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
  ) {}

  validateQuestions(questions: IQuestion[]): void {
    if (!questions || questions.length === 0) {
      throw new BadRequestException('Exam must have at least one question');
    }

    questions.forEach((question, index) => {
      // Validate question structure
      if (!question.questionDisplayName) {
        throw new BadRequestException(`Question ${index + 1}: questionDisplayName is required`);
      }

      if (!question.category) {
        throw new BadRequestException(`Question ${index + 1}: category is required`);
      }

      if (typeof question.point !== 'number' || question.point <= 0) {
        throw new BadRequestException(`Question ${index + 1}: point must be a positive number`);
      }

      // Validate based on category
      if (question.category === QuestionCategoryEnum.TRUE_FALSE) {
        // For true/false, correctAnswer must be boolean
        if (typeof question.correctAnswer !== 'boolean') {
          throw new BadRequestException(
            `Question ${index + 1}: correctAnswer must be a boolean (true/false) for TRUE_FALSE category`,
          );
        }
        // answers should not be provided for true/false
        if (question.answers && question.answers.length > 0) {
          throw new BadRequestException(
            `Question ${index + 1}: answers array should not be provided for TRUE_FALSE category`,
          );
        }
      } else {
        // For single choice and multiple choice, answers array is required
        if (!question.answers || question.answers.length === 0) {
          throw new BadRequestException(
            `Question ${index + 1}: answers array is required for ${question.category} category`,
          );
        }

        // At least one answer must be correct
        const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect);
        if (!hasCorrectAnswer) {
          throw new BadRequestException(
            `Question ${index + 1}: at least one answer must be marked as correct`,
          );
        }

        // Validate each answer
        question.answers.forEach((answer, answerIndex) => {
          if (!answer.answerDisplayedText) {
            throw new BadRequestException(
              `Question ${index + 1}, Answer ${answerIndex + 1}: answerDisplayedText is required`,
            );
          }
          if (typeof answer.isCorrect !== 'boolean') {
            throw new BadRequestException(
              `Question ${index + 1}, Answer ${answerIndex + 1}: isCorrect must be a boolean`,
            );
          }
        });

        // correctAnswer should not be provided for non-true/false categories
        if (typeof question.correctAnswer === 'boolean') {
          throw new BadRequestException(
            `Question ${index + 1}: correctAnswer should not be provided for ${question.category} category`,
          );
        }
      }
    });
  }

  validateTotalPoints(questions: IQuestion[], totalPoint: number): void {
    const sumOfPoints = questions.reduce((sum, q) => sum + q.point, 0);
    if (sumOfPoints !== totalPoint) {
      throw new BadRequestException(
        `Total points mismatch: Sum of question points (${sumOfPoints}) must equal totalPoint (${totalPoint})`,
      );
    }
  }

  async createExam(createExamDto: any): Promise<Exam> {
    // Validate questions
    this.validateQuestions(createExamDto.questions);

    // Validate total points
    this.validateTotalPoints(createExamDto.questions, createExamDto.totalPoint);

    // Create and save exam
    const exam = this.examsRepository.create(createExamDto);
    const savedExam = await this.examsRepository.save(exam);
    return savedExam as unknown as Exam;
  }

  async findAll(): Promise<Exam[]> {
    return this.examsRepository.find();
  }

  async findAllWithoutQuestions(): Promise<Partial<Exam>[]> {
    const exams = await this.examsRepository.find();
    return exams.map(exam => {
      const { questions, ...examWithoutQuestions } = exam;
      return examWithoutQuestions;
    });
  }

  async findById(id: number): Promise<Exam | null> {
    return this.examsRepository.findOne({ where: { id } });
  }

  async updateExam(id: number, updateExamDto: any): Promise<Exam> {
    // Check if exam exists
    const exam = await this.findById(id);
    if (!exam) {
      throw new BadRequestException(`Exam with ID ${id} not found`);
    }

    // Validate questions if provided
    if (updateExamDto.questions) {
      this.validateQuestions(updateExamDto.questions);
      this.validateTotalPoints(updateExamDto.questions, updateExamDto.totalPoint);
    }

    // Update exam
    Object.assign(exam, updateExamDto);
    const updatedExam = await this.examsRepository.save(exam);
    return updatedExam as unknown as Exam;
  }

  async deleteExam(id: number): Promise<{ message: string; id: number }> {
    const exam = await this.findById(id);
    if (!exam) {
      throw new BadRequestException(`Exam with ID ${id} not found`);
    }

    await this.examsRepository.remove(exam);
    return { message: 'Exam deleted successfully', id };
  }

  async toggleExamActive(id: number): Promise<{ message: string; id: number; isActive: boolean }> {
    const exam = await this.findById(id);
    if (!exam) {
      throw new BadRequestException(`Exam with ID ${id} not found`);
    }

    exam.isActive = !exam.isActive;
    const updatedExam = await this.examsRepository.save(exam);
    return {
      message: 'Exam active status toggled',
      id: updatedExam.id,
      isActive: updatedExam.isActive,
    };
  }
}
