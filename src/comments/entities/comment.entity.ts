export interface Comment {
  id: number;
  articleId: number;
  author: string;
  content: string;
  date: string;
  highlighted: boolean;
}

export type NewComment = Omit<Comment, 'id' | 'date' | 'highlighted'> & {
  highlighted?: boolean;
};
