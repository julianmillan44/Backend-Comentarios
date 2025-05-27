import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';
export declare class CommentsService {
    private commentModel;
    constructor(commentModel: Model<CommentDocument>);
    create(createCommentDto: CreateCommentDto): Promise<ApiResponse<Comment>>;
    findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Comment>>;
    findAllAdmin(query: PaginationQueryDto): Promise<PaginatedResponse<Comment>>;
    findPending(): Promise<ApiResponse<Comment[]>>;
    findRecent(limit?: number): Promise<ApiResponse<Comment[]>>;
    approve(id: string): Promise<ApiResponse<Comment>>;
    reject(id: string): Promise<ApiResponse<Comment>>;
    remove(id: string): Promise<ApiResponse<void>>;
    getPendingCount(): Promise<ApiResponse<{
        count: number;
    }>>;
}
