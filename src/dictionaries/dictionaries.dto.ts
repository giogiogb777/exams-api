export class DictionaryItemDto {
  label: string;
  value: number;
}

export class QuestionCategoryResponseDto extends DictionaryItemDto {}

export class DifficultyResponseDto extends DictionaryItemDto {}

export class ExamCategoryResponseDto extends DictionaryItemDto {}

export class PermissionResponseDto extends DictionaryItemDto {}

export class StatusResponseDto extends DictionaryItemDto {}
