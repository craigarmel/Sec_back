export interface Article {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  date: string;
  author: string;
}

export type NewArticle = Omit<Article, 'id'>;
