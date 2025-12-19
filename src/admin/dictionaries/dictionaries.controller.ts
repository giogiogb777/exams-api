import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DictionariesService } from './dictionaries.service';
import {
  QuestionCategoryResponseDto,
  DifficultyResponseDto,
  ExamCategoryResponseDto,
} from './dictionaries.dto';

@ApiTags('admin / dictionaries')
@Controller('admin/dictionaries')
export class DictionariesController {
  constructor(private dictionariesService: DictionariesService) {}

  @Get('question-categories')
  @ApiOperation({
    summary: 'Get all question categories for exam creation',
    description: `
      Retrieve all available question category types that can be used when creating exam questions.
      
      Question Categories:
      
      1. **True/False (true_false)**
         - Questions with a simple true/false answer
         - Single correctAnswer boolean field required (no answers array)
         - Best for factual recall questions
         - Example: "Is JavaScript a compiled language?"
      
      2. **Single Choice (single_choice)**
         - Multiple choice questions with exactly one correct answer
         - Requires answers array with at least one marked as correct
         - Presents options to user, only one can be selected
         - Example: "What is the correct syntax for arrow functions?"
      
      3. **Multiple Choice (multiple_choice)**
         - Multiple choice questions where multiple answers can be correct
         - Requires answers array with at least one marked as correct
         - Users can select multiple answers
         - Example: "Which of the following are JavaScript data types?"
      
      Use these values in the 'category' field when creating questions in exams.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all question categories',
    type: [QuestionCategoryResponseDto],
    schema: {
      example: [
        {
          key: 'true_false',
          value: 'true_false',
          label: 'True/False',
        },
        {
          key: 'single_choice',
          value: 'single_choice',
          label: 'Single Choice',
        },
        {
          key: 'multiple_choice',
          value: 'multiple_choice',
          label: 'Multiple Choice',
        },
      ],
    },
  })
  getQuestionCategories(): QuestionCategoryResponseDto[] {
    return this.dictionariesService.getQuestionCategories() as QuestionCategoryResponseDto[];
  }

  @Get('difficulties')
  @ApiOperation({
    summary: 'Get all difficulty levels for questions',
    description: `
      Retrieve all available difficulty levels for exam questions.
      
      Difficulty Levels:
      
      1. **Easy**
         - Beginner level questions
         - Basic concepts and fundamental knowledge
         - Suitable for users new to the subject
         - Example: "What is a variable?"
      
      2. **Medium**
         - Intermediate level questions
         - Requires understanding of core concepts
         - Suitable for users with foundational knowledge
         - Example: "How does event delegation work?"
      
      3. **Hard**
         - Advanced level questions
         - Requires deep understanding and experience
         - Suitable for experienced developers
         - Example: "Explain closure scoping in detail"
      
      Use these values in the 'difficulty' field when creating exams.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all difficulty levels',
    type: [DifficultyResponseDto],
    schema: {
      example: [
        {
          key: 'easy',
          value: 'easy',
          label: 'Easy',
        },
        {
          key: 'medium',
          value: 'medium',
          label: 'Medium',
        },
        {
          key: 'hard',
          value: 'hard',
          label: 'Hard',
        },
      ],
    },
  })
  getDifficulties(): DifficultyResponseDto[] {
    return this.dictionariesService.getDifficulties() as DifficultyResponseDto[];
  }

  @Get('exam-categories')
  @ApiOperation({
    summary: 'Get all available exam categories/subjects',
    description: `
      Retrieve all available exam categories that represent different frontend technologies and subjects.
      
      Available Categories:
      
      1. **JavaScript**
         - Core JavaScript language and concepts
         - Covers ES5 and modern JavaScript (ES6+)
         - Topics: variables, functions, closures, async/await, etc.
      
      2. **TypeScript**
         - TypeScript type system and advanced features
         - Type annotations, generics, interfaces, decorators
      
      3. **React**
         - React framework and ecosystem
         - Components, hooks, state management, performance
      
      4. **Angular**
         - Angular framework and architecture
         - Dependency injection, services, RxJS integration
      
      5. **Vue**
         - Vue.js framework
         - Vue 2 and Vue 3 composition API
      
      6. **HTML & CSS**
         - HTML markup and semantic HTML
         - CSS styling, layouts, responsive design, animations
      
      7. **General**
         - General frontend knowledge
         - Web APIs, browser concepts, accessibility
      
      Use these values in the 'category' field when creating exams.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all exam categories',
    type: [ExamCategoryResponseDto],
    schema: {
      example: [
        {
          key: 'javascript',
          value: 'javascript',
          label: 'JavaScript',
        },
        {
          key: 'typescript',
          value: 'typescript',
          label: 'TypeScript',
        },
        {
          key: 'react',
          value: 'react',
          label: 'React',
        },
        {
          key: 'angular',
          value: 'angular',
          label: 'Angular',
        },
        {
          key: 'vue',
          value: 'vue',
          label: 'Vue',
        },
        {
          key: 'html_css',
          value: 'html_css',
          label: 'HTML & CSS',
        },
        {
          key: 'general',
          value: 'general',
          label: 'General',
        },
      ],
    },
  })
  getExamCategories(): ExamCategoryResponseDto[] {
    return this.dictionariesService.getExamCategories() as ExamCategoryResponseDto[];
  }
}
