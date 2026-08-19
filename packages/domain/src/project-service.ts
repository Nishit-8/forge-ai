import type {
  CreateProjectInput,
  Project,
  ProjectRepository,
  UpdateProjectInput,
} from "./index";

export class ProjectService {

  constructor(private readonly repository: ProjectRepository) { }

  async listProjects(): Promise<Project[]> {
    return this.repository.findAll();
  }

  async getProject(id: string): Promise<Project | null> {
    return this.repository.findById(id);
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    return this.repository.create(input);
  }

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project | null> {
    return this.repository.update(id, input);
  }
}
