import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exam } from '../admin/exams/exam.entity';
import { User } from '../users/user.entity';

@Entity('test_results')
export class TestResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examId: number;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  totalPoint: number;

  @Column()
  scorePoints: number;

  @Column('simple-json')
  submittedAnswers: Array<{
    questionId: number;
    answered: boolean;
    isCorrect: boolean;
  }>;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  submittedAt: Date;
}
