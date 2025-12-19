export class DictionaryItemDto {
  key: string;
  value: string;
  label: string;
}

export class QuestionCategoryResponseDto extends DictionaryItemDto {}

export class DifficultyResponseDto extends DictionaryItemDto {}

export class ExamCategoryResponseDto extends DictionaryItemDto {}
