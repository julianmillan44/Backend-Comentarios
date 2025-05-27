import { Model } from 'mongoose';
import { ContactMessage, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';
export declare class ContactService {
    private contactModel;
    constructor(contactModel: Model<ContactDocument>);
    create(createContactDto: CreateContactDto): Promise<ApiResponse<ContactMessage>>;
    findAll(query: PaginationQueryDto): Promise<PaginatedResponse<ContactMessage>>;
    findUnread(): Promise<ApiResponse<ContactMessage[]>>;
    findOne(id: string): Promise<ApiResponse<ContactMessage>>;
    markAsRead(id: string): Promise<ApiResponse<ContactMessage>>;
    markAsUnread(id: string): Promise<ApiResponse<ContactMessage>>;
    remove(id: string): Promise<ApiResponse<void>>;
    getUnreadCount(): Promise<ApiResponse<{
        count: number;
    }>>;
    search(term: string, query: PaginationQueryDto): Promise<PaginatedResponse<ContactMessage>>;
    findByDateRange(startDate: string, endDate: string): Promise<ApiResponse<ContactMessage[]>>;
}
