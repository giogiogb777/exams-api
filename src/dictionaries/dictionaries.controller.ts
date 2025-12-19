import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DictionariesService } from './dictionaries.service';
import {
  QuestionCategoryResponseDto,
  DifficultyResponseDto,
  ExamCategoryResponseDto,
  PermissionResponseDto,
  StatusResponseDto,
} from './dictionaries.dto';

@ApiTags('dictionaries')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private dictionariesService: DictionariesService) {}

  @Get('question-categories')
  @ApiOperation({
    summary: 'Get all question categories for exam creation',
    description: `
      Retrieve all available question category types that can be used when creating exam questions.
      
      Question Categories:
      
      1. **True/False**
         - Questions with a simple true/false answer
         - Single correctAnswer boolean field required (no answers array)
         - Best for factual recall questions
         - Example: "Is JavaScript a compiled language?"
      
      2. **Single Choice**
         - Multiple choice questions with exactly one correct answer
         - Requires answers array with at least one marked as correct
         - Presents options to user, only one can be selected
         - Example: "What is the correct syntax for arrow functions?"
      
      3. **Multiple Choice**
         - Multiple choice questions where multiple answers can be correct
         - Requires answers array with at least one marked as correct
         - Users can select multiple answers
         - Example: "Which of the following are JavaScript data types?"
      
      Use the 'value' field when creating questions in exams.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all question categories',
    type: [QuestionCategoryResponseDto],
    schema: {
      example: [
        {
          label: 'True/False',
          value: 1,
        },
        {
          label: 'Single Choice',
          value: 2,
        },
        {
          label: 'Multiple Choice',
          value: 3,
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
      
      Use the 'value' field when creating exams.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all difficulty levels',
    type: [DifficultyResponseDto],
    schema: {
      example: [
        {
          label: 'Easy',
          value: 1,
        },
        {
          label: 'Medium',
          value: 2,
        },
        {
          label: 'Hard',
          value: 3,
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
          label: 'JavaScript',
          value: 1,
        },
        {
          label: 'TypeScript',
          value: 2,
        },
        {
          label: 'React',
          value: 3,
        },
        {
          label: 'Angular',
          value: 4,
        },
        {
          label: 'Vue',
          value: 5,
        },
        {
          label: 'HTML & CSS',
          value: 6,
        },
        {
          label: 'General',
          value: 7,
        },
      ],
    },
  })
  getExamCategories(): ExamCategoryResponseDto[] {
    return this.dictionariesService.getExamCategories() as ExamCategoryResponseDto[];
  }

  @Get('permissions')
  @ApiOperation({
    summary: 'Get all user role permissions and their descriptions',
    description: `
      Retrieve all available user roles/permissions in the system.
      
      Role Hierarchy & Permissions:
      
      1. **User (1)**
         - Basic user account
         - Can take exams and view personal test results
         - Cannot manage exams or other users' results
         - Entry-level access to the platform
      
      2. **Moderator (2)**
         - Can do everything a User can do
         - Can view all test results submitted by any user
         - Can delete/clear test results
         - Can toggle exam active status (pause/resume exams)
         - Cannot create, edit, or delete exams
         - Suitable for team members overseeing test administration
      
      3. **Admin (4)**
         - Can do everything a Moderator can do
         - Can create new exams with questions
         - Can edit existing exams and their questions
         - Can delete exams from the system
         - Full system control and management
         - Suitable for platform administrators and exam creators
      
      Use these values when creating user accounts or checking permissions.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all available permissions',
    type: [PermissionResponseDto],
    schema: {
      example: [
        {
          label: 'User',
          value: 1,
        },
        {
          label: 'Moderator',
          value: 2,
        },
        {
          label: 'Admin',
          value: 4,
        },
      ],
    },
  })
  getPermissions(): PermissionResponseDto[] {
    return this.dictionariesService.getPermissions() as PermissionResponseDto[];
  }

  @Get('statuses')
  @ApiOperation({
    summary: 'Get all status values',
    description: `
      Retrieve all available status values in the system.
      
      Status Values:
      
      1. **Active**
         - Status value: 1
         - Used for entities that are currently active/enabled
      
      2. **Inactive**
         - Status value: 2
         - Used for entities that are currently inactive/disabled
      
      Use the 'value' field when filtering or creating entities with status.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all statuses',
    type: [StatusResponseDto],
    schema: {
      example: [
        {
          label: 'Active',
          value: 1,
        },
        {
          label: 'Inactive',
          value: 2,
        },
      ],
    },
  })
  getStatuses(): StatusResponseDto[] {
    return this.dictionariesService.getStatuses() as StatusResponseDto[];
  }
}
