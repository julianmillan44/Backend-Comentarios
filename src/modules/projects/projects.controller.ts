import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured projects' })
  @ApiResponse({ status: 200, description: 'Featured projects retrieved successfully' })
  findFeatured() {
    return this.projectsService.findFeatured();
  }

  @Get('technologies')
  @ApiOperation({ summary: 'Get all unique technologies' })
  @ApiResponse({ status: 200, description: 'Technologies retrieved successfully' })
  getTechnologies() {
    return this.projectsService.getTechnologies();
  }

  @Get('technology/:technology')
  @ApiOperation({ summary: 'Get projects by technology' })
  @ApiResponse({ status: 200, description: 'Projects by technology retrieved successfully' })
  findByTechnology(@Param('technology') technology: string) {
    return this.projectsService.findByTechnology(technology);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}