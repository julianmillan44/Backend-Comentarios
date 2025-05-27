import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/contact.schema").ContactMessage>>;
    findAll(query: PaginationQueryDto): Promise<import("../../common/interfaces/api-response.interface").PaginatedResponse<import("./schemas/contact.schema").ContactMessage>>;
    findUnread(): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/contact.schema").ContactMessage[]>>;
    getUnreadCount(): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<{
        count: number;
    }>>;
    search(term: string, query: PaginationQueryDto): Promise<import("../../common/interfaces/api-response.interface").PaginatedResponse<import("./schemas/contact.schema").ContactMessage>>;
    findByDateRange(startDate: string, endDate: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/contact.schema").ContactMessage[]>>;
    findOne(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/contact.schema").ContactMessage>>;
    markAsRead(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/contact.schema").ContactMessage>>;
    markAsUnread(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/contact.schema").ContactMessage>>;
    remove(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<void>>;
}
