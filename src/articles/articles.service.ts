import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article, NewArticle } from './entities/article.entity';
import { escapeHtml } from '../common/security/sanitize.util';

@Injectable()
export class ArticlesService {
  private articles: Article[] = [
    {
      id: 1,
      title: 'Bienvenue sur le blog',
      description: 'Article de démonstration',
      imageUrl: 'https://example.com/image.png',
      link: 'https://example.com',
      date: new Date().toISOString(),
      author: 'Admin',
    },
  ];

  private nextId = this.articles.length + 1;

  findAll(): Article[] {
    return this.articles;
  }

  findOne(id: number): Article {
    const article = this.articles.find((entry) => entry.id === id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  create(payload: NewArticle): Article {
    if (
      !payload.title?.trim() ||
      !payload.description?.trim() ||
      !payload.link?.trim() ||
      !payload.author?.trim()
    ) {
      throw new BadRequestException('Missing required article fields');
    }

    const article: Article = {
      id: this.nextId++,
      ...payload,
      title: escapeHtml(payload.title),
      description: escapeHtml(payload.description),
      author: escapeHtml(payload.author),
    };
    this.articles.push(article);
    return article;
  }

  update(id: number, payload: Partial<NewArticle>): Article {
    const article = this.findOne(id);
    const updated: Article = {
      ...article,
      ...payload,
      title: payload.title ? escapeHtml(payload.title) : article.title,
      description: payload.description
        ? escapeHtml(payload.description)
        : article.description,
      author: payload.author ? escapeHtml(payload.author) : article.author,
    };

    this.articles = this.articles.map((entry) =>
      entry.id === id ? updated : entry,
    );
    return updated;
  }

  remove(id: number): void {
    const before = this.articles.length;
    this.articles = this.articles.filter((entry) => entry.id !== id);

    if (before === this.articles.length) {
      throw new NotFoundException('Article not found');
    }
  }
}
