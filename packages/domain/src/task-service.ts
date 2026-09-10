import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from "./task";
import type { TaskRepository } from "./task-repository";

export interface PlanTaskStep {
  title: string;
  description: string;
}

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) {}

  async listByProject(projectId: string): Promise<Task[]> {
    return this.taskRepository.findByProjectId(projectId);
  }

  async getById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    return this.taskRepository.create(input);
  }

  async createFromPlan(
    projectId: string,
    steps: PlanTaskStep[],
  ): Promise<Task[]> {
    const tasks: Task[] = [];

    for (const step of steps) {
      const task = await this.create({
        projectId,
        title: step.title,
        description: step.description,
        priority: "medium",
      });

      tasks.push(task);
    }

    return tasks;
  }

  async update(
    id: string,
    input: UpdateTaskInput,
  ): Promise<Task | null> {
    return this.taskRepository.update(id, input);
  }
}
