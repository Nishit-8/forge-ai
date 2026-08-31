import { ProjectService, TaskService } from "@forgeai/domain";
import { LibSQLProjectRepository, database, LibSQLTaskRepository } from "@forgeai/infrastructure";

import { createMastra, smokeTestAgent } from "@forgeai/mastra";
import { RequestContext } from "@mastra/core/request-context";
import { randomUUID } from "node:crypto";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { getRequestId, runWithRequestContext } from "./context/request-context.js";
import { ApiError, toApiErrorResponse } from "./errors/api-error.js";

interface AppDependencies {
  projectService: ProjectService;
  taskService: TaskService;
  smokeTestAgent: {
    generate(prompt: string): Promise<{ text: string }>;
  };
  forgeAiAgent: {
    generate(
      prompt: string,
      options: {
        requestContext: RequestContext<{ requestId: string }>;
        toolChoice?: "auto" | "none" | "required" | undefined;
        activeTools?: string[] | undefined
      },
    ): Promise<{ text: string }>;
  };
}

export function createApp(appDependencies?: AppDependencies) {
  const projectRepository = new LibSQLProjectRepository(database);
  const taskRepository = new LibSQLTaskRepository(database);

  const projectService = appDependencies?.projectService ?? new ProjectService(projectRepository);
  const taskService = appDependencies?.taskService ?? new TaskService(taskRepository);

  const smokeAgent = appDependencies?.smokeTestAgent ?? smokeTestAgent;

  const mastra = appDependencies?.forgeAiAgent === undefined ? createMastra(projectService, taskService) : undefined;

  const forgeAgent = appDependencies?.forgeAiAgent ?? mastra!.getAgentById("forgeai-agent");

  return createServer((req, res) => {
    void handleRequest(
      req,
      res,
      projectService,
      taskService,
      smokeAgent,
      forgeAgent
    )
  })
}

function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: unknown
): void {
  const requestId = getRequestId();

  res.writeHead(statusCode, {
    "content-type": "application/json",
    "x-request-id": requestId ?? "",
  })

  res.end(JSON.stringify(body));
}

function parsePath(url: string): string[] {
  return new URL(url, "http:localhost").pathname
    .split("/")
    .filter(Boolean)
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    return {};
  }

  const body = Buffer.concat(chunks).toString("utf-8");

  return JSON.parse(body);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  projectService: ProjectService,
  taskService: TaskService,
  smokeAgent: {
    generate(prompt: string): Promise<{ text: string }>;
  },
  forgeAgent: {
    generate(
      prompt: string,
      options: {
        requestContext: RequestContext<{ requestId: string }>;
        toolChoice?: "auto" | "none" | "required" | undefined;
        activeTools?: string[] | undefined
      },
    ): Promise<{ text: string }>;
  },
): Promise<void> {

  const requestId = randomUUID();

  return runWithRequestContext(
    { requestId },
    async () => {

      console.log(`[request:${requestId}] ${req.method ?? "UNKNOWN"} ${req.url ?? "/"}`);

      try {
        if (req.url === "/health" && req.method === "GET") {
          sendJson(res, 200, {
            status: "ok",
          });

          return;
        }

        const path = parsePath(req.url ?? "/");

        /*
         * GET /api/ai/health
         */
        if (
          req.method === "GET" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "ai" &&
          path[2] === "health"
        ) {
          sendJson(res, 200, {
            status: "ok",
            mastra: "ok",
            gemini: "configured",
          });

          return;
        }

        /*
          * POST /api/ai/test
          */
        if (
          req.method === "POST" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "ai" &&
          path[2] === "test"
        ) {
          const body = await readJsonBody(req);

          if (!isRecord(body)) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Request body must be a JSON object",
            );
          }

          const prompt =
            typeof body.prompt === "string" && body.prompt.trim().length > 0
              ? body.prompt.trim()
              : "Reply with exactly: ForgeAI AI smoke test successful.";

          if (prompt.length > 500) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Prompt must be 500 characters or fewer",
            );
          }

          const result = await smokeAgent.generate(prompt);

          sendJson(res, 200, {
            response: result.text,
          });

          return;
        }

        /*
         * GET /api/projects
         */
        if (
          req.method === "GET" &&
          path.length === 2 &&
          path[0] === "api" &&
          path[1] === "projects"
        ) {
          const projects = await projectService.listProjects();

          sendJson(res, 200, projects);
          return;
        }

        /*
         * POST /api/projects
         */
        if (
          req.method === "POST" &&
          path.length === 2 &&
          path[0] === "api" &&
          path[1] === "projects"
        ) {
          const body = await readJsonBody(req);

          if (!isRecord(body)) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Request body must be a JSON object",
            );
          }

          const project = await projectService.createProject(body as never);

          sendJson(res, 201, project);
          return;
        }

        /*
         * GET /api/projects/:id
         */
        if (
          req.method === "GET" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "projects"
        ) {
          const project = await projectService.getProject(path[2]);

          if (!project) {
            throw new ApiError(
              404,
              "RESOURCE_NOT_FOUND",
              "Project was not found",
            );
          }

          sendJson(res, 200, project);
          return;
        }

        /*
         * PATCH /api/projects/:id
         */
        if (
          req.method === "PATCH" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "projects"
        ) {
          const body = await readJsonBody(req);

          if (!isRecord(body)) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Request body must be a JSON object",
            );
          }

          const project = await projectService.updateProject(
            path[2],
            body as never,
          );

          if (!project) {
            throw new ApiError(
              404,
              "RESOURCE_NOT_FOUND",
              "Project was not found",
            );
          }

          sendJson(res, 200, project);
          return;
        }

        /*
         * GET /api/projects/:projectId/tasks
         */
        if (
          req.method === "GET" &&
          path.length === 4 &&
          path[0] === "api" &&
          path[1] === "projects" &&
          path[3] === "tasks"
        ) {
          const tasks = await taskService.listByProject(path[2]);

          sendJson(res, 200, tasks);
          return;
        }

        /*
         * POST /api/projects/:projectId/tasks
         */
        if (
          req.method === "POST" &&
          path.length === 4 &&
          path[0] === "api" &&
          path[1] === "projects" &&
          path[3] === "tasks"
        ) {
          const body = await readJsonBody(req);

          if (!isRecord(body)) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Request body must be a JSON object",
            );
          }

          const task = await taskService.create({
            ...body,
            projectId: path[2],
          } as never);

          sendJson(res, 201, task);
          return;
        }

        /*
         * GET /api/tasks/:id
         */
        if (
          req.method === "GET" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "tasks"
        ) {
          const task = await taskService.getById(path[2]);

          if (!task) {
            throw new ApiError(
              404,
              "RESOURCE_NOT_FOUND",
              "Task was not found",
            );
          }

          sendJson(res, 200, task);
          return;
        }

        /*
         * PATCH /api/tasks/:id
         */
        if (
          req.method === "PATCH" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "tasks"
        ) {
          const body = await readJsonBody(req);

          if (!isRecord(body)) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Request body must be a JSON object",
            );
          }

          const task = await taskService.update(
            path[2],
            body as never,
          );

          if (!task) {
            throw new ApiError(
              404,
              "RESOURCE_NOT_FOUND",
              "Task was not found",
            );
          }

          sendJson(res, 200, task);
          return;
        }

        /*
        * POST /api/ai/agent
        */
        if (
          req.method === "POST" &&
          path.length === 3 &&
          path[0] === "api" &&
          path[1] === "ai" &&
          path[2] === "agent"
        ) {
          const body = await readJsonBody(req);

          if (!isRecord(body)) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Request body must be a JSON object",
            );
          }

          const prompt =
            typeof body.prompt === "string"
              ? body.prompt.trim()
              : "";

          const toolChoice =
            body.toolChoice === "auto" ||
              body.toolChoice === "none" ||
              body.toolChoice === "required"
              ? body.toolChoice
              : undefined;

          const activeTools = Array.isArray(body.activeTools) &&
            body.activeTools.every((tool) => typeof tool === "string")
            ? body.activeTools : undefined;

          if (prompt.length === 0) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Prompt is required",
            );
          }

          if (prompt.length > 500) {
            throw new ApiError(
              400,
              "INVALID_REQUEST",
              "Prompt must be 500 characters or fewer",
            );
          }

          const requestContext = new RequestContext<{
            requestId: string;
          }>();

          requestContext.set("requestId", requestId);

          const result = await forgeAgent.generate(prompt, {
            requestContext,
            toolChoice,
            activeTools
          });

          sendJson(res, 200, {
            response: result.text,
          });

          return;
        }

        throw new ApiError(
          404,
          "RESOURCE_NOT_FOUND",
          "Route not found",
        );
      } catch (error) {
        console.error(`[request:${requestId}]`, error);

        const apiErrorResponse = toApiErrorResponse(error);

        const statusCode =
          error instanceof ApiError
            ? error.statusCode
            : 500;

        sendJson(res, statusCode, apiErrorResponse);
      }
    }
  )
}
