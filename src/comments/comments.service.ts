import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../common/entities/comment.entity';
import { Post } from '../common/entities/post.entity';
import { User } from '../common/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Article non trouvé');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      post,
      author,
    });

    const savedComment = await this.commentRepository.save(comment);
    
    // Recharger le commentaire avec les relations pour retourner les données complètes
    const commentWithRelations = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'post'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        postId: true,
        author: {
          id: true,
          name: true,
        },
      },
    });

    if (!commentWithRelations) {
      throw new NotFoundException('Erreur lors de la création du commentaire');
    }

    return commentWithRelations;
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });

    if (!comment) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    return comment;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const comment = await this.findOne(id);

    // Protection IDOR : Seul l'auteur ou un admin peut supprimer
    if (comment.authorId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres commentaires',
      );
    }

    await this.commentRepository.remove(comment);
  }
}

