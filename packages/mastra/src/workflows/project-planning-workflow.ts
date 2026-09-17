import { ProjectService, TaskService } from "@forgeai/domain";
import {
  LibSQLProjectRepository,
  LibSQLTaskRepository,
  database,
} from "@forgeai/infrastructure";

import { createMastra } from "../index.js";


const projectRepository = new LibSQLProjectRepository(database);
const taskRepository = new LibSQLTaskRepository(database);

const projectService = new ProjectService(projectRepository);
const taskService = new TaskService(taskRepository);

const mastra = createMastra(projectService, taskService);

const workflow = mastra.getWorkflow("projectPlanningWorkflow");

const run = await workflow.createRun();

const projectId = process.argv[2];

if (!projectId) {
  throw new Error(
    "Usage: npm run workflow:project-planning --workspace=@forgeai/mastra -- <projectId>",
  );
}

const request = "Create a plan for improving this project.";

const stream = run.stream({
  inputData: {
    projectId,
    request,
  },
  initialState: {
    status: "pending",
  },
});

for await (const chunk of stream) {
  console.log("Workflow event:");
  console.log(JSON.stringify(chunk, null, 2));
}
