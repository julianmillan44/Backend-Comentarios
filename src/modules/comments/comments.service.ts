import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<ApiResponse<Comment>> {
    try {
      const comment = new this.commentModel(createCommentDto);
      const savedComment = await comment.save();
      return {
        success: true,
        data: savedComment,
        message: 'Comment created successfully and is pending approval',
      };
    } catch (error) {
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

      const [comments, total] = await Promise.all([
        this.commentModel.find({ approved: true }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
        this.commentModel.countDocuments({ approved: true }).exec(),
      ]);

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

      const [comments, total] = await Promise.all([
        this.commentModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
        this.commentModel.countDocuments().exec(),
      ]);

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
      const comments = await this.commentModel.find({ approved: false }).sort({ createdAt: -1 }).exec();
      return {
        success: true,
        data: comments,
        message: 'Pending comments retrieved successfully',
      };
    } catch (error) {
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
      const comments = await this.commentModel
        .find({ approved: true })
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
      return {
        success: true,
        data: comments,
        message: 'Recent comments retrieved successfully',
      };
    } catch (error) {
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
      const comment = await this.commentModel
        .findByIdAndUpdate(id, { approved: true }, { new: true })
        .exec();
      if (!comment) {
        return {
          success: false,
          message: 'Comment not found',
        };
      }
      return {
        success: true,
        data: comment,
        message: 'Comment approved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error approving comment',
        errors: [error.message],
      };
    }
  }

  async reject(id: string): Promise<ApiResponse<Comment>> {
    try {
      const comment = await this.commentModel
        .findByIdAndUpdate(id, { approved: false }, { new: true })
        .exec();
      if (!comment) {
        return {
          success: false,
          message: 'Comment not found',
        };
      }
      return {
        success: true,
        data: comment,
        message: 'Comment rejected successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error rejecting comment',
        errors: [error.message],
      };
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.commentModel.findByIdAndDelete(id).exec();
      if (!result) {
        return {
          success: false,
          message: 'Comment not found',
        };
      }
      return {
        success: true,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
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
      return {
        success: true,
        data: { count },
        message: 'Pending comments count retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: { count: 0 },
        message: 'Error getting pending comments count',
        errors: [error.message],
      };
    }
  }
}