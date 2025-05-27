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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
let ProjectsService = class ProjectsService {
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async create(createProjectDto) {
        try {
            const project = new this.projectModel(createProjectDto);
            const savedProject = await project.save();
            return {
                success: true,
                data: savedProject,
                message: 'Project created successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error creating project',
                errors: [error.message],
            };
        }
    }
    async findAll(query) {
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
        }
        catch (error) {
            return {
                success: false,
                data: [],
                pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                message: 'Error fetching projects',
            };
        }
    }
    async findFeatured() {
        try {
            const projects = await this.projectModel.find({ featured: true }).sort({ createdAt: -1 }).exec();
            return {
                success: true,
                data: projects,
                message: 'Featured projects retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching featured projects',
                errors: [error.message],
            };
        }
    }
    async findOne(id) {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Error fetching project',
                errors: [error.message],
            };
        }
    }
    async findByTechnology(technology) {
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
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching projects by technology',
                errors: [error.message],
            };
        }
    }
    async getTechnologies() {
        try {
            const technologies = await this.projectModel.distinct('technologies').exec();
            return {
                success: true,
                data: technologies,
                message: 'Technologies retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: [],
                message: 'Error fetching technologies',
                errors: [error.message],
            };
        }
    }
    async update(id, updateProjectDto) {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Error updating project',
                errors: [error.message],
            };
        }
    }
    async remove(id) {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Error deleting project',
                errors: [error.message],
            };
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map