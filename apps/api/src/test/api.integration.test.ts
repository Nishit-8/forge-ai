// import test from "node:test";
// import assert from "node:assert/strict";

// import {
//   LibSQLProjectRepository,
//   LibSQLTaskRepository,
// } from "@forgeai/infrastructure";
// import { ProjectService, TaskService, type Project } from "@forgeai/domain";

// import { createApp } from "../app.js";
// import { createTestDatabase } from "./test-database.js";
// import type { AddressInfo } from "node:net";

// test("GET /health returns healthy", async () => {
//   const database = await createTestDatabase();

//   const projectService = new ProjectService(
//     new LibSQLProjectRepository(database),
//   );

//   const taskService = new TaskService(
//     new LibSQLTaskRepository(database),
//   );

//   const app = createApp({
//     projectService,
//     taskService,
//     smokeTestAgent: {
//       async generate() {
//         return {
//           text: "test",
//         };
//       },
//     },
//   });

//   await new Promise<void>((resolve) => {
//     app.listen(0, resolve);
//   });

//   try {
//     const address = app.address() as AddressInfo;

//     assert.ok(address);
//     assert.equal(typeof address, "object");

//     const response = await fetch(
//       `http://127.0.0.1:${address.port}/health`,
//     );

//     assert.equal(response.status, 200);

//     const body = await response.json();

//     assert.deepEqual(body, {
//       status: "ok",
//     });
//   } finally {
//     await new Promise<void>((resolve, reject) => {
//       app.close((error) => {
//         if (error) {
//           reject(error);
//           return;
//         }

//         resolve();
//       });
//     });

//     database.close();
//   }
// });

// test("POST /api/projects creates a project", async () => {
//   const database = await createTestDatabase();

//   const app = createApp({
//     projectService: new ProjectService(
//       new LibSQLProjectRepository(database),
//     ),
//     taskService: new TaskService(
//       new LibSQLTaskRepository(database),
//     ),
//     smokeTestAgent: {
//       async generate() {
//         return { text: "test" };
//       },
//     },
//   });

//   await new Promise<void>((resolve) => {
//     app.listen(0, resolve);
//   });

//   try {
//     const address = app.address() as AddressInfo;

//     assert.ok(address);
//     assert.equal(typeof address, "object");

//     const response = await fetch(
//       `http://127.0.0.1:${address.port}/api/projects`,
//       {
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({
//           name: "Integration Project",
//           description: "Created by integration test",
//         }),
//       },
//     );

//     assert.equal(response.status, 201);

//     const project = await response.json() as Project;

//     assert.equal(project.name, "Integration Project");
//     assert.equal(project.description, "Created by integration test");
//     assert.equal(project.status, "active");
//   } finally {
//     await new Promise<void>((resolve, reject) => {
//       app.close((error) => {
//         if (error) {
//           reject(error);
//           return;
//         }

//         resolve();
//       });
//     });

//     database.close();
//   }
// });

// test("GET unknown project returns stable 404 error", async () => {
//   const database = await createTestDatabase();

//   const app = createApp({
//     projectService: new ProjectService(
//       new LibSQLProjectRepository(database),
//     ),
//     taskService: new TaskService(
//       new LibSQLTaskRepository(database),
//     ),
//     smokeTestAgent: {
//       async generate() {
//         return { text: "test" };
//       },
//     },
//   });

//   await new Promise<void>((resolve) => {
//     app.listen(0, resolve);
//   });

//   try {
//     const address = app.address() as AddressInfo;

//     assert.ok(address);
//     assert.equal(typeof address, "object");

//     const response = await fetch(
//       `http://127.0.0.1:${address.port}/api/projects/missing-project`,
//     );

//     assert.equal(response.status, 404);

//     const body = await response.json() as any;

//     assert.equal(
//       body.error.code,
//       "RESOURCE_NOT_FOUND",
//     );

//     assert.equal(
//       body.error.message,
//       "Project was not found",
//     );

//     assert.ok(body.error.requestId);
//   } finally {
//     await new Promise<void>((resolve, reject) => {
//       app.close((error) => {
//         if (error) {
//           reject(error);
//           return;
//         }

//         resolve();
//       });
//     });

//     database.close();
//   }
// });
