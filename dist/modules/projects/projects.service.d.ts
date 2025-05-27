import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ApiResponse, PaginatedResponse } from '../../common/interfaces/api-response.interface';
export declare class ProjectsService {
    private projectModel;
    constructor(projectModel: Model<ProjectDocument>);
    create(createProjectDto: CreateProjectDto): Promise<ApiResponse<Project>>;
    findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Project>>;
    findFeatured(): Promise<ApiResponse<Project[]>>;
    findOne(id: string): Promise<ApiResponse<Project>>;
    findByTechnology(technology: string): Promise<ApiResponse<Project[]>>;
    getTechnologies(): Promise<ApiResponse<string[]>>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<ApiResponse<Project>>;
    remove(id: string): Promise<ApiResponse<void>>;
}
