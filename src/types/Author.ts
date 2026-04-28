export interface Author {
    id: string,
    name: string,
    nationality: string
}

export interface AuthorResponse {
    content: Author[];
    totalElements: number;
}
