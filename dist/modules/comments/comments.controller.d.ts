import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/comment.schema").Comment>>;
    findAll(query: PaginationQueryDto): Promise<import("../../common/interfaces/api-response.interface").PaginatedResponse<import("./schemas/comment.schema").Comment>>;
    findAllAdmin(query: PaginationQueryDto): Promise<import("../../common/interfaces/api-response.interface").PaginatedResponse<import("./schemas/comment.schema").Comment>>;
    findPending(): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/comment.schema").Comment[]>>;
    getPendingCount(): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<{
        count: number;
    }>>;
    findRecent(limit?: number): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/comment.schema").Comment[]>>;
    approve(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/comment.schema").Comment>>;
    reject(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/comment.schema").Comment>>;
    remove(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<void>>;
}
