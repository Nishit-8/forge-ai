import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from "./task";

export interface TaskRepository {
  findByProjectId(projectId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task | null>;
}
