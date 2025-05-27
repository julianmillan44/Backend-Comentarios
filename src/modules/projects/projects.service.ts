import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ApiResponse<Project>> {
    try {
      const project = new this.projectModel(createProjectDto);
      const savedProject = await project.save();
      return {
        success: true,
        data: savedProject,
        message: 'Project created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating project',
        errors: [error.message],
      };
    }
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Project>> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        this.projectModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
        this.projectModel.countDocuments().exec(),
      ]);

      return {
        success: true,
        data: projects,
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
        message: 'Error fetching projects',
      };
    }
  }

  async findFeatured(): Promise<ApiResponse<Project[]>> {
    try {
      const projects = await this.projectModel.find({ featured: true }).sort({ createdAt: -1 }).exec();
      return {
        success: true,
        data: projects,
        message: 'Featured projects retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error fetching featured projects',
        errors: [error.message],
      };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Project>> {
    try {
      const project = await this.projectModel.findById(id).exec();
      if (!project) {
        return {
          success: false,
          message: 'Project not found',
        };
      }
      return {
        success: true,
        data: project,
        message: 'Project retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching project',
        errors: [error.message],
      };
    }
  }

  async findByTechnology(technology: string): Promise<ApiResponse<Project[]>> {
    try {
      const projects = await this.projectModel
        .find({ technologies: { $in: [technology] } })
        .sort({ createdAt: -1 })
        .exec();
      return {
        success: true,
        data: projects,
        message: `Projects with ${technology} retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error fetching projects by technology',
        errors: [error.message],
      };
    }
  }

  async getTechnologies(): Promise<ApiResponse<string[]>> {
    try {
      const technologies = await this.projectModel.distinct('technologies').exec();
      return {
        success: true,
        data: technologies,
        message: 'Technologies retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error fetching technologies',
        errors: [error.message],
      };
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ApiResponse<Project>> {
    try {
      const project = await this.projectModel
        .findByIdAndUpdate(id, updateProjectDto, { new: true })
        .exec();
      if (!project) {
        return {
          success: false,
          message: 'Project not found',
        };
      }
      return {
        success: true,
        data: project,
        message: 'Project updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error updating project',
        errors: [error.message],
      };
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.projectModel.findByIdAndDelete(id).exec();
      if (!result) {
        return {
          success: false,
          message: 'Project not found',
        };
      }
      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error deleting project',
        errors: [error.message],
      };
    }
  }
}