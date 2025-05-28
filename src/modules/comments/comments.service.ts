import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<ApiResponse<Comment>> {
    try {
      this.logger.log(`Creating comment: ${JSON.stringify(createCommentDto)}`);
      
      const comment = new this.commentModel({
        ...createCommentDto,
        approved: false, // Por defecto no aprobado
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedComment = await comment.save();
      this.logger.log(`Comment created successfully: ${savedComment._id}`);
      
      return {
        success: true,
        data: savedComment,
        message: 'Comment created successfully and is pending approval',
      };
    } catch (error) {
      this.logger.error(`Error creating comment: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error creating comment',
        errors: [error.message],
      };
    }
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Comment>> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      this.logger.log(`Fetching approved comments - Page: ${page}, Limit: ${limit}`);

      // Primero verificar cuántos comentarios hay en total
      const totalComments = await this.commentModel.countDocuments().exec();
      const approvedComments = await this.commentModel.countDocuments({ approved: true }).exec();
      
      this.logger.log(`Total comments in DB: ${totalComments}, Approved: ${approvedComments}`);

      const [comments, total] = await Promise.all([
        this.commentModel
          .find({ approved: true })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean() // Usar lean() para mejor performance
          .exec(),
        this.commentModel.countDocuments({ approved: true }).exec(),
      ]);

      this.logger.log(`Found ${comments.length} approved comments for page ${page}`);

      // Log de algunos comentarios para debug
      if (comments.length > 0) {
        this.logger.log(`First comment: ${JSON.stringify(comments[0])}`);
      }

      return {
        success: true,
        data: comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        message: `Found ${comments.length} comments`
      };
    } catch (error) {
      this.logger.error(`Error fetching comments: ${error.message}`, error.stack);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: 'Error fetching comments',
      };
    }
  }

  async findAllAdmin(query: PaginationQueryDto): Promise<PaginatedResponse<Comment>> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      this.logger.log(`Fetching all comments for admin - Page: ${page}, Limit: ${limit}`);

      const [comments, total] = await Promise.all([
        this.commentModel
          .find()
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        this.commentModel.countDocuments().exec(),
      ]);

      this.logger.log(`Found ${comments.length} total comments for admin`);

      return {
        success: true,
        data: comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching admin comments: ${error.message}`, error.stack);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: 'Error fetching comments',
      };
    }
  }

  async findPending(): Promise<ApiResponse<Comment[]>> {
    try {
      this.logger.log('Fetching pending comments');
      
      const comments = await this.commentModel
        .find({ approved: false })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
        
      this.logger.log(`Found ${comments.length} pending comments`);
      
      return {
        success: true,
        data: comments,
        message: 'Pending comments retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error fetching pending comments: ${error.message}`, error.stack);
      return {
        success: false,
        data: [],
        message: 'Error fetching pending comments',
        errors: [error.message],
      };
    }
  }

  async findRecent(limit: number = 5): Promise<ApiResponse<Comment[]>> {
    try {
      this.logger.log(`Fetching ${limit} recent comments`);
      
      const comments = await this.commentModel
        .find({ approved: true })
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
        
      this.logger.log(`Found ${comments.length} recent comments`);
      
      return {
        success: true,
        data: comments,
        message: 'Recent comments retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error fetching recent comments: ${error.message}`, error.stack);
      return {
        success: false,
        data: [],
        message: 'Error fetching recent comments',
        errors: [error.message],
      };
    }
  }

  async approve(id: string): Promise<ApiResponse<Comment>> {
    try {
      this.logger.log(`Approving comment: ${id}`);
      
      const comment = await this.commentModel
        .findByIdAndUpdate(
          id, 
          { 
            approved: true,
            updatedAt: new Date()
          }, 
          { new: true }
        )
        .exec();
        
      if (!comment) {
        this.logger.warn(`Comment not found for approval: ${id}`);
        return {
          success: false,
          message: 'Comment not found',
        };
      }
      
      this.logger.log(`Comment approved successfully: ${id}`);
      
      return {
        success: true,
        data: comment,
        message: 'Comment approved successfully',
      };
    } catch (error) {
      this.logger.error(`Error approving comment: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error approving comment',
        errors: [error.message],
      };
    }
  }

  async reject(id: string): Promise<ApiResponse<Comment>> {
    try {
      this.logger.log(`Rejecting comment: ${id}`);
      
      const comment = await this.commentModel
        .findByIdAndUpdate(
          id, 
          { 
            approved: false,
            updatedAt: new Date()
          }, 
          { new: true }
        )
        .exec();
        
      if (!comment) {
        this.logger.warn(`Comment not found for rejection: ${id}`);
        return {
          success: false,
          message: 'Comment not found',
        };
      }
      
      this.logger.log(`Comment rejected successfully: ${id}`);
      
      return {
        success: true,
        data: comment,
        message: 'Comment rejected successfully',
      };
    } catch (error) {
      this.logger.error(`Error rejecting comment: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error rejecting comment',
        errors: [error.message],
      };
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      this.logger.log(`Deleting comment: ${id}`);
      
      const result = await this.commentModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        this.logger.warn(`Comment not found for deletion: ${id}`);
        return {
          success: false,
          message: 'Comment not found',
        };
      }
      
      this.logger.log(`Comment deleted successfully: ${id}`);
      
      return {
        success: true,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting comment: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error deleting comment',
        errors: [error.message],
      };
    }
  }

  async getPendingCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const count = await this.commentModel.countDocuments({ approved: false }).exec();
      this.logger.log(`Pending comments count: ${count}`);
      
      return {
        success: true,
        data: { count },
        message: 'Pending comments count retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error getting pending comments count: ${error.message}`, error.stack);
      return {
        success: false,
        data: { count: 0 },
        message: 'Error getting pending comments count',
        errors: [error.message],
      };
    }
  }

  // Método adicional para debug - aprobar todos los comentarios
  async approveAllForTesting(): Promise<ApiResponse<{ modifiedCount: number }>> {
    try {
      this.logger.log('Approving all comments for testing');
      
      const result = await this.commentModel.updateMany(
        { approved: false },
        { 
          approved: true,
          updatedAt: new Date()
        }
      ).exec();
      
      this.logger.log(`Approved ${result.modifiedCount} comments for testing`);
      
      return {
        success: true,
        data: { modifiedCount: result.modifiedCount },
        message: `Approved ${result.modifiedCount} comments`,
      };
    } catch (error) {
      this.logger.error(`Error approving all comments: ${error.message}`, error.stack);
      return {
        success: false,
        data: { modifiedCount: 0 },
        message: 'Error approving all comments',
        errors: [error.message],
      };
    }
  }
}