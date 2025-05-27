import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ApiResponse<ContactMessage>> {
    try {
      const contact = new this.contactModel(createContactDto);
      const savedContact = await contact.save();
      return {
        success: true,
        data: savedContact,
        message: 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error sending message',
        errors: [error.message],
      };
    }
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<ContactMessage>> {
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
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: 'Error fetching messages',
      };
    }
  }

  async findUnread(): Promise<ApiResponse<ContactMessage[]>> {
    try {
      const messages = await this.contactModel.find({ read: false }).sort({ createdAt: -1 }).exec();
      return {
        success: true,
        data: messages,
        message: 'Unread messages retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error fetching unread messages',
        errors: [error.message],
      };
    }
  }

  async findOne(id: string): Promise<ApiResponse<ContactMessage>> {
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
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching message',
        errors: [error.message],
      };
    }
  }

  async markAsRead(id: string): Promise<ApiResponse<ContactMessage>> {
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
    } catch (error) {
      return {
        success: false,
        message: 'Error marking message as read',
        errors: [error.message],
      };
    }
  }

  async markAsUnread(id: string): Promise<ApiResponse<ContactMessage>> {
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
    } catch (error) {
      return {
        success: false,
        message: 'Error marking message as unread',
        errors: [error.message],
      };
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
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
    } catch (error) {
      return {
        success: false,
        message: 'Error deleting message',
        errors: [error.message],
      };
    }
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const count = await this.contactModel.countDocuments({ read: false }).exec();
      return {
        success: true,
        data: { count },
        message: 'Unread messages count retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: { count: 0 },
        message: 'Error getting unread messages count',
        errors: [error.message],
      };
    }
  }

  async search(term: string, query: PaginationQueryDto): Promise<PaginatedResponse<ContactMessage>> {
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
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: 'Error searching messages',
      };
    }
  }

  async findByDateRange(startDate: string, endDate: string): Promise<ApiResponse<ContactMessage[]>> {
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
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error fetching messages by date range',
        errors: [error.message],
      };
    }
  }
}