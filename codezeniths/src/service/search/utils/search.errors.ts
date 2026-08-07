export class SearchError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'SearchError';
    this.code = code;
  }
}

export class CollectionNotFoundError extends SearchError {
  constructor(collectionName: string) {
    super(`Collection "${collectionName}" is not registered.`, 'COLLECTION_NOT_FOUND');
    this.name = 'CollectionNotFoundError';
  }
}

export class SearchValidationError extends SearchError {
  readonly validationErrors: string[];
  constructor(message: string, validationErrors: string[] = []) {
    super(message, 'SEARCH_VALIDATION_ERROR');
    this.name = 'SearchValidationError';
    this.validationErrors = validationErrors;
  }
}

export class IndexingError extends SearchError {
  constructor(message: string) {
    super(message, 'INDEXING_ERROR');
    this.name = 'IndexingError';
  }
}
