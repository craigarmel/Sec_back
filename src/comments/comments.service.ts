import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Comment, NewComment } from './entities/comment.entity';
import { escapeHtml } from '../common/security/sanitize.util';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [
    {
      id: 1,
      articleId: 1,
      author: 'Admin',
      content: 'Premier commentaire',
      date: new Date().toISOString(),
      highlighted: false,
    },
  ];

  private nextId = this.comments.length + 1;

  findAll(articleId?: number): Comment[] {
    if (articleId) {
      return this.comments.filter((entry) => entry.articleId === articleId);
    }

    return this.comments;
  }

  findOne(id: number): Comment {
    const comment = this.comments.find((entry) => entry.id === id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  create(payload: NewComment): Comment {
    if (!payload.content || !payload.content.trim()) {
      throw new BadRequestException('Comment content is required');
    }

    const comment: Comment = {
      id: this.nextId++,
      date: new Date().toISOString(),
      highlighted: Boolean(payload.highlighted),
      ...payload,
      content: escapeHtml(payload.content),
    };

    this.comments.push(comment);
    return comment;
  }

  update(id: number, payload: Partial<NewComment>): Comment {
    const existing = this.findOne(id);
    const updated: Comment = {
      ...existing,
      ...payload,
      highlighted: payload.highlighted ?? existing.highlighted,
      content:
        typeof payload.content === 'string'
          ? escapeHtml(payload.content)
          : existing.content,
    };

    this.comments = this.comments.map((entry) =>
      entry.id === id ? updated : entry,
    );
    return updated;
  }

  remove(id: number): void {
    const before = this.comments.length;
    this.comments = this.comments.filter((entry) => entry.id !== id);

    if (before === this.comments.length) {
      throw new NotFoundException('Comment not found');
    }
  }
}
