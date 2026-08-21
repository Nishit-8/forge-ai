import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from "./task";
import type { TaskRepository } from "./task-repository";

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) { }

  async listByProject(projectId: string): Promise<Task[]> {
    
    return this.taskRepository.findByProjectId(projectId);
  }

  async getById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    return this.taskRepository.create(input);
  }

  async update(
    id: string,
    input: UpdateTaskInput,
  ): Promise<Task | null> {
    return this.taskRepository.update(id, input);
  }
}
