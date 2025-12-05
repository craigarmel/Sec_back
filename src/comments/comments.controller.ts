import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  BadRequestException,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CommentsService } from './comments.service';
import type { NewComment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Query('articleId') articleId?: string) {
    const parsedId = articleId ? Number(articleId) : undefined;
    if (articleId && !Number.isInteger(parsedId)) {
      throw new BadRequestException('articleId must be a number');
    }
    return this.commentsService.findAll(parsedId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: NewComment, @Req() req: Request) {
    const parsedArticleId = Number(body.articleId);
    if (!Number.isInteger(parsedArticleId)) {
      throw new BadRequestException('articleId must be a number');
    }

    const user = req.user as { email?: string };
    return this.commentsService.create({
      ...body,
      articleId: parsedArticleId,
      author: user?.email ?? body.author,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<NewComment>,
  ) {
    return this.commentsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.commentsService.remove(id);
    return { deleted: true };
  }
}
