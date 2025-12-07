import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { User } from '../common/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      author,
    });

    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Article non trouvé');
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    currentUser: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // Protection IDOR : Seul l'auteur ou un admin peut modifier
    if (post.authorId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres articles',
      );
    }

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const post = await this.findOne(id);

    // Protection IDOR : Seul l'auteur ou un admin peut supprimer
    if (post.authorId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres articles',
      );
    }

    await this.postRepository.remove(post);
  }
}

