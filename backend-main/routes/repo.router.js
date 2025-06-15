const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

// Repository CRUD operations
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.put("/repo/settings/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

// File management operations
repoRouter.post("/repo/:repositoryId/files", repoController.addFileToRepository);
repoRouter.get("/repo/:repositoryId/files/:fileName", repoController.getFileContent);
repoRouter.put("/repo/:repositoryId/files/:fileName", repoController.updateFileInRepository);
repoRouter.delete("/repo/:repositoryId/files/:fileName", repoController.deleteFileFromRepository);

module.exports = repoRouter;
