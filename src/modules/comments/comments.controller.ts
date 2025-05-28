import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    this.logger.log(`Creating comment: ${JSON.stringify(createCommentDto)}`);
    const result = await this.commentsService.create(createCommentDto);
    this.logger.log(`Comment creation result: ${JSON.stringify(result)}`);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get approved comments with pagination' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async findAll(@Query() query: PaginationQueryDto) {
    this.logger.log(`Fetching comments with query: ${JSON.stringify(query)}`);
    const result = await this.commentsService.findAll(query);
    this.logger.log(`Comments fetch result: Found ${result.data?.length || 0} comments`);
    return result;
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all comments for admin with pagination' })
  @ApiResponse({ status: 200, description: 'All comments retrieved successfully' })
  async findAllAdmin(@Query() query: PaginationQueryDto) {
    this.logger.log(`Fetching admin comments with query: ${JSON.stringify(query)}`);
    return this.commentsService.findAllAdmin(query);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending comments for approval' })
  @ApiResponse({ status: 200, description: 'Pending comments retrieved successfully' })
  async findPending() {
    this.logger.log('Fetching pending comments');
    return this.commentsService.findPending();
  }

  @Get('pending/count')
  @ApiOperation({ summary: 'Get count of pending comments' })
  @ApiResponse({ status: 200, description: 'Pending comments count retrieved successfully' })
  async getPendingCount() {
    return this.commentsService.getPendingCount();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent approved comments' })
  @ApiResponse({ status: 200, description: 'Recent comments retrieved successfully' })
  async findRecent(@Query('limit') limit?: number) {
    return this.commentsService.findRecent(limit);
  }

  // Endpoint temporal para debug - aprobar todos los comentarios
  @Post('approve-all-for-testing')
  @ApiOperation({ summary: 'Approve all comments for testing (temporal)' })
  @ApiResponse({ status: 200, description: 'All comments approved for testing' })
  async approveAllForTesting() {
    this.logger.log('ADMIN: Approving all comments for testing');
    return this.commentsService.approveAllForTesting();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a comment' })
  @ApiResponse({ status: 200, description: 'Comment approved successfully' })
  async approve(@Param('id') id: string) {
    this.logger.log(`Approving comment: ${id}`);
    return this.commentsService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a comment' })
  @ApiResponse({ status: 200, description: 'Comment rejected successfully' })
  async reject(@Param('id') id: string) {
    this.logger.log(`Rejecting comment: ${id}`);
    return this.commentsService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting comment: ${id}`);
    return this.commentsService.remove(id);
  }
}