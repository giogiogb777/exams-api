import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { QuestionCategoryEnum, DifficultyEnum, ExamCategoryEnum } from '../../dictionaries/dictionaries.service';

export interface IAnswer {
  answerDisplayedText: string;
  isCorrect: boolean;
}

export interface IQuestion {
  questionDisplayName: string;
  category: QuestionCategoryEnum;
  point: number;
  isRequired: boolean;
  answers?: IAnswer[];
  correctAnswer?: boolean;
}

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examName: string;

  @Column()
  examDuration: number; // in minutes

  @Column()
  totalPoint: number;

  @Column({ type: 'simple-json' })
  questions: IQuestion[];

  @Column()
  category: ExamCategoryEnum;

  @Column()
  difficulty: DifficultyEnum;

  @Column({ type: 'integer', default: 1 })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
