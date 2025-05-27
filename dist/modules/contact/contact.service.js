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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_schema_1 = require("./schemas/contact.schema");
let ContactService = class ContactService {
    constructor(contactModel) {
        this.contactModel = contactModel;
    }
    async create(createContactDto) {
        try {
            const contact = new this.contactModel(createContactDto);
            const savedContact = await contact.save();
            return {
                success: true,
                data: savedContact,
                message: 'Message sent successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error sending message',
                errors: [error.message],
            };
        }
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 10 } = query;
            const skip = (page - 1) * limit;
            const [messages, total] = await Promise.all([
                this.contactModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
                this.contactModel.countDocuments().exec(),
            ]);
            return {
                success: true,
                data: messages,
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
                message: 'Error fetching messages',
            };
        }
    }
    async findUnread() {
        try {
            const messages = await this.contactModel.find({ read: false }).sort({ createdAt: -1 }).exec();
            return {
                success: true,
                data: messages,
                message: 'Unread messages retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching unread messages',
                errors: [error.message],
            };
        }
    }
    async findOne(id) {
        try {
            const message = await this.contactModel.findById(id).exec();
            if (!message) {
                return {
                    success: false,
                    message: 'Message not found',
                };
            }
            return {
                success: true,
                data: message,
                message: 'Message retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error fetching message',
                errors: [error.message],
            };
        }
    }
    async markAsRead(id) {
        try {
            const message = await this.contactModel
                .findByIdAndUpdate(id, { read: true }, { new: true })
                .exec();
            if (!message) {
                return {
                    success: false,
                    message: 'Message not found',
                };
            }
            return {
                success: true,
                data: message,
                message: 'Message marked as read',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error marking message as read',
                errors: [error.message],
            };
        }
    }
    async markAsUnread(id) {
        try {
            const message = await this.contactModel
                .findByIdAndUpdate(id, { read: false }, { new: true })
                .exec();
            if (!message) {
                return {
                    success: false,
                    message: 'Message not found',
                };
            }
            return {
                success: true,
                data: message,
                message: 'Message marked as unread',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error marking message as unread',
                errors: [error.message],
            };
        }
    }
    async remove(id) {
        try {
            const result = await this.contactModel.findByIdAndDelete(id).exec();
            if (!result) {
                return {
                    success: false,
                    message: 'Message not found',
                };
            }
            return {
                success: true,
                message: 'Message deleted successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error deleting message',
                errors: [error.message],
            };
        }
    }
    async getUnreadCount() {
        try {
            const count = await this.contactModel.countDocuments({ read: false }).exec();
            return {
                success: true,
                data: { count },
                message: 'Unread messages count retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: { count: 0 },
                message: 'Error getting unread messages count',
                errors: [error.message],
            };
        }
    }
    async search(term, query) {
        try {
            const { page = 1, limit = 10 } = query;
            const skip = (page - 1) * limit;
            const searchQuery = {
                $or: [
                    { name: { $regex: term, $options: 'i' } },
                    { email: { $regex: term, $options: 'i' } },
                    { subject: { $regex: term, $options: 'i' } },
                    { message: { $regex: term, $options: 'i' } },
                ],
            };
            const [messages, total] = await Promise.all([
                this.contactModel.find(searchQuery).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
                this.contactModel.countDocuments(searchQuery).exec(),
            ]);
            return {
                success: true,
                data: messages,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                message: `Found ${total} messages matching "${term}"`,
            };
        }
        catch (error) {
            return {
                success: false,
                data: [],
                pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                message: 'Error searching messages',
            };
        }
    }
    async findByDateRange(startDate, endDate) {
        try {
            const messages = await this.contactModel
                .find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            })
                .sort({ createdAt: -1 })
                .exec();
            return {
                success: true,
                data: messages,
                message: 'Messages retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching messages by date range',
                errors: [error.message],
            };
        }
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_schema_1.ContactMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContactService);
//# sourceMappingURL=contact.service.js.map