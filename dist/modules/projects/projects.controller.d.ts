import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/project.schema").Project>>;
    findAll(query: PaginationQueryDto): Promise<import("../../common/interfaces/api-response.interface").PaginatedResponse<import("./schemas/project.schema").Project>>;
    findFeatured(): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/project.schema").Project[]>>;
    getTechnologies(): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<string[]>>;
    findByTechnology(technology: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/project.schema").Project[]>>;
    findOne(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/project.schema").Project>>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./schemas/project.schema").Project>>;
    remove(id: string): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<void>>;
}
