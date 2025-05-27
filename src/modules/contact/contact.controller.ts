import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Send a contact message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact messages with pagination' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.contactService.findAll(query);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread contact messages' })
  @ApiResponse({ status: 200, description: 'Unread messages retrieved successfully' })
  findUnread() {
    return this.contactService.findUnread();
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get count of unread messages' })
  @ApiResponse({ status: 200, description: 'Unread messages count retrieved successfully' })
  getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search contact messages' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') term: string, @Query() query: PaginationQueryDto) {
    return this.contactService.search(term, query);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get messages by date range' })
  @ApiResponse({ status: 200, description: 'Messages by date range retrieved successfully' })
  findByDateRange(@Query('start') startDate: string, @Query('end') endDate: string) {
    return this.contactService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Patch(':id/unread')
  @ApiOperation({ summary: 'Mark message as unread' })
  @ApiResponse({ status: 200, description: 'Message marked as unread' })
  markAsUnread(@Param('id') id: string) {
    return this.contactService.markAsUnread(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}