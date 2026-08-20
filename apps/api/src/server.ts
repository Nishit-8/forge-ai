import { ProjectService, TaskService } from '@forgeai/domain';
import { database, LibSQLProjectRepository, LibSQLTaskRepository } from '@forgeai/infrastructure';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import {
  getRequestId,
  runWithRequestContext
} from "./context/request-context.js";

import { smokeTestAgent } from "@forgeai/mastra";

const PORT = Number(process.env.PORT ?? 3000);

const projectRepository = new LibSQLProjectRepository(database);
const taskRepository = new LibSQLTaskRepository(database);

const projectService = new ProjectService(projectRepository);
const taskService = new TaskService(taskRepository);

function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: unknown
): void {
  const requestId = getRequestId();

  res.writeHead(statusCode, {
    "content-type": "application/json",
    "x-request-id": requestId ?? ""
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
  res: ServerResponse
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
            sendJson(res, 400, {
              error: "Request body must be a JSON object",
            });

            return;
          }

          const prompt =
            typeof body.prompt === "string" && body.prompt.trim().length > 0
              ? body.prompt.trim()
              : "Reply with exactly: ForgeAI AI smoke test successful.";

          if (prompt.length > 500) {
            sendJson(res, 400, {
              error: "Prompt must be 500 characters or fewer",
            });

            return;
          }

          const result = await smokeTestAgent.generate(prompt);

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
            sendJson(res, 400, {
              error: "Request body must be a JSON object",
            });
            return;
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
            sendJson(res, 404, {
              error: "Project not found",
            });
            return;
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
            sendJson(res, 400, {
              error: "Request body must be a JSON object",
            });
            return;
          }

          const project = await projectService.updateProject(
            path[2],
            body as never,
          );

          if (!project) {
            sendJson(res, 404, {
              error: "Project not found",
            });
            return;
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
            sendJson(res, 400, {
              error: "Request body must be a JSON object",
            });
            return;
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
            sendJson(res, 404, {
              error: "Task not found",
            });
            return;
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
            sendJson(res, 400, {
              error: "Request body must be a JSON object",
            });
            return;
          }

          const task = await taskService.update(
            path[2],
            body as never,
          );

          if (!task) {
            sendJson(res, 404, {
              error: "Task not found",
            });
            return;
          }

          sendJson(res, 200, task);
          return;
        }

        sendJson(res, 404, {
          error: "Not Found",
        });
      } catch (error) {
        console.error(error);

        if (error instanceof SyntaxError) {
          sendJson(res, 400, {
            error: "Invalid JSON",
          });

          return;
        }

        sendJson(res, 500, {
          error: "Internal Server Error",
        });
      }
    }
  )
}


const server = createServer((req, res) => {
  void handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Forge API listening on http://localhost:${PORT}`);
});
