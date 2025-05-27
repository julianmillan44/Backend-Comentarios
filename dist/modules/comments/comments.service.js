"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
let CommentsService = class CommentsService {
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(createCommentDto) {
        try {
            const comment = new this.commentModel(createCommentDto);
            const savedComment = await comment.save();
            return {
                success: true,
                data: savedComment,
                message: 'Comment created successfully and is pending approval',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error creating comment',
                errors: [error.message],
            };
        }
    }
    async findAll(query) {
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
        }
        catch (error) {
            return {
                success: false,
                data: [],
                pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                message: 'Error fetching comments',
            };
        }
    }
    async findAllAdmin(query) {
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
        }
        catch (error) {
            return {
                success: false,
                data: [],
                pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                message: 'Error fetching comments',
            };
        }
    }
    async findPending() {
        try {
            const comments = await this.commentModel.find({ approved: false }).sort({ createdAt: -1 }).exec();
            return {
                success: true,
                data: comments,
                message: 'Pending comments retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching pending comments',
                errors: [error.message],
            };
        }
    }
    async findRecent(limit = 5) {
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
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching recent comments',
                errors: [error.message],
            };
        }
    }
    async approve(id) {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Error approving comment',
                errors: [error.message],
            };
        }
    }
    async reject(id) {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Error rejecting comment',
                errors: [error.message],
            };
        }
    }
    async remove(id) {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Error deleting comment',
                errors: [error.message],
            };
        }
    }
    async getPendingCount() {
        try {
            const count = await this.commentModel.countDocuments({ approved: false }).exec();
            return {
                success: true,
                data: { count },
                message: 'Pending comments count retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: { count: 0 },
                message: 'Error getting pending comments count',
                errors: [error.message],
            };
        }
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentsService);
//# sourceMappingURL=comments.service.js.map