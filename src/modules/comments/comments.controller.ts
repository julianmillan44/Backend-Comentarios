import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get approved comments with pagination' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.commentsService.findAll(query);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all comments for admin with pagination' })
  @ApiResponse({ status: 200, description: 'All comments retrieved successfully' })
  findAllAdmin(@Query() query: PaginationQueryDto) {
    return this.commentsService.findAllAdmin(query);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending comments for approval' })
  @ApiResponse({ status: 200, description: 'Pending comments retrieved successfully' })
  findPending() {
    return this.commentsService.findPending();
  }

  @Get('pending/count')
  @ApiOperation({ summary: 'Get count of pending comments' })
  @ApiResponse({ status: 200, description: 'Pending comments count retrieved successfully' })
  getPendingCount() {
    return this.commentsService.getPendingCount();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent approved comments' })
  @ApiResponse({ status: 200, description: 'Recent comments retrieved successfully' })
  findRecent(@Query('limit') limit?: number) {
    return this.commentsService.findRecent(limit);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a comment' })
  @ApiResponse({ status: 200, description: 'Comment approved successfully' })
  approve(@Param('id') id: string) {
    return this.commentsService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a comment' })
  @ApiResponse({ status: 200, description: 'Comment rejected successfully' })
  reject(@Param('id') id: string) {
    return this.commentsService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}