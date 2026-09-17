import { ProjectService, TaskService } from "@forgeai/domain";
import {
  LibSQLProjectRepository,
  LibSQLTaskRepository,
  database,
} from "@forgeai/infrastructure";

import { createMastra } from "./index.js";

const projectRepository = new LibSQLProjectRepository(database);
const taskRepository = new LibSQLTaskRepository(database);

const projectService = new ProjectService(projectRepository);
const taskService = new TaskService(taskRepository);

const mastra = createMastra(projectService, taskService);

const workflow = mastra.getWorkflow("projectPlanningWorkflow")

const run = await workflow.createRun();

const projectId = process.argv[2];

if (!projectId) {
  throw new Error(
    "Usage: npm run workflow:project-planning --workspace=@forgeai/mastra -- <projectId>",
  );
}

const request = "Create a plan for improving this project.";

const result = await run.start({
  inputData: {
    projectId,
    request,
  },
  initialState: {
    status: "pending",
  },
});

console.log(`Workflow status: ${result.status}`);

if (result.status === "success") {
  console.log("Workflow completed successfully.");
  console.log("Workflow result:");
  console.log(JSON.stringify(result.result, null, 2));
}

if (result.status === "failed") {
  console.error("Workflow failed:");
  console.error(result.error);
}
