const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

// Helper function to generate commit IDs
function generateCommitId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    // Check if repository name already exists for this user
    const existingRepo = await Repository.findOne({ name, owner });
    if (existingRepo) {
      return res.status(409).json({ error: "Repository with this name already exists!" });
    }

    // Process content to ensure proper structure
    const processedContent = content ? content.map(file => ({
      name: file.name,
      content: file.content || "",
      type: file.type || "file",
      path: file.path || file.name,
      size: file.content ? file.content.length : 0,
      lastModified: new Date(),
    })) : [];

    const newRepository = new Repository({
      name,
      description: description || "",
      visibility: visibility !== undefined ? visibility : true,
      owner,
      content: processedContent,
      issues: issues || [],
      stars: 0,
      forks: 0,
      language: "JavaScript",
      topics: [],
      readme: processedContent.find(file => file.name.toLowerCase() === 'readme.md')?.content || "",
      defaultBranch: "main",
      commits: [{
        id: generateCommitId(),
        message: "Initial commit",
        author: owner,
        timestamp: new Date(),
        changes: processedContent.map(file => ({
          file: file.name,
          action: "added",
          additions: file.content ? file.content.split('\n').length : 0,
          deletions: 0,
        })),
      }],
    });

    const result = await newRepository.save();

    res.status(201).json({
      success: true,
      message: "Repository created successfully!",
      repositoryID: result._id,
      repository: result,
    });
  } catch (err) {
    console.error("Error during repository creation:", err.message);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Repository name already exists!" });
    }
    res.status(500).json({ error: "Server error during repository creation" });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repository = await Repository.findById(id)
      .populate("owner", "username email")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).json({ error: "Server error during repository fetch" });
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    const repository = await Repository.findOne({ name: name.trim() })
      .populate("owner", "username email")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).json({ error: "Server error during repository fetch" });
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  console.log({ userID: req.params.userID });
  const { userID } = req.params;

  try {
    // Validate userID
    if (!userID || userID === 'null' || userID === 'undefined') {
      return res.status(400).json({ error: "Invalid user ID!" });
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ error: "Invalid user ID format!" });
    }

    const repositories = await Repository.find({ owner: userID })
      .populate("owner", "username email")
      .populate("issues")
      .sort({ updatedAt: -1 });

    if (!repositories || repositories.length == 0) {
      return res.json({ message: "No repositories found for this user.", repositories: [] });
    }

    console.log(`Found ${repositories.length} repositories for user ${userID}`);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).json({ error: "Server error during user repositories fetch" });
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description, name, visibility, topics, readme } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Update fields if provided
    if (content !== undefined) {
      repository.content = Array.isArray(content) ? content : [];
    }

    if (description !== undefined) {
      repository.description = description;
    }

    if (name !== undefined && name.trim() !== '') {
      // Check if new name already exists for this user
      const existingRepo = await Repository.findOne({
        name: name.trim(),
        owner: repository.owner,
        _id: { $ne: id }
      });

      if (existingRepo) {
        return res.status(409).json({ error: "Repository with this name already exists!" });
      }

      repository.name = name.trim();
    }

    if (visibility !== undefined) {
      repository.visibility = visibility;
    }

    if (topics !== undefined) {
      repository.topics = Array.isArray(topics) ? topics : [];
    }

    if (readme !== undefined) {
      repository.readme = readme;
    }

    const updatedRepository = await repository.save();

    res.json({
      success: true,
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).json({ error: "Server error during repository update" });
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}

// Add file to repository
async function addFileToRepository(req, res) {
  const { repositoryId } = req.params;
  const { name, content, type, path } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Check if file already exists
    const existingFile = repository.content.find(file => file.name === name && file.path === (path || name));
    if (existingFile) {
      return res.status(409).json({ error: "File already exists!" });
    }

    const newFile = {
      name,
      content: content || "",
      type: type || "file",
      path: path || name,
      size: content ? content.length : 0,
      lastModified: new Date(),
    };

    repository.content.push(newFile);

    // Add commit
    const commitId = generateCommitId();
    repository.commits.push({
      id: commitId,
      message: `Add ${name}`,
      author: repository.owner,
      timestamp: new Date(),
      changes: [{
        file: name,
        action: "added",
        additions: content ? content.split('\n').length : 0,
        deletions: 0,
      }],
    });

    await repository.save();

    res.status(201).json({
      success: true,
      message: "File added successfully!",
      file: newFile,
      repository,
    });
  } catch (err) {
    console.error("Error adding file:", err.message);
    res.status(500).json({ error: "Server error while adding file" });
  }
}

// Update file in repository
async function updateFileInRepository(req, res) {
  const { repositoryId, fileName } = req.params;
  const { content, commitMessage } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const fileIndex = repository.content.findIndex(file => file.name === fileName);
    if (fileIndex === -1) {
      return res.status(404).json({ error: "File not found!" });
    }

    const oldContent = repository.content[fileIndex].content;
    const oldLines = oldContent.split('\n').length;
    const newLines = content.split('\n').length;

    // Update file
    repository.content[fileIndex].content = content;
    repository.content[fileIndex].size = content.length;
    repository.content[fileIndex].lastModified = new Date();

    // Add commit
    const commitId = generateCommitId();
    repository.commits.push({
      id: commitId,
      message: commitMessage || `Update ${fileName}`,
      author: repository.owner,
      timestamp: new Date(),
      changes: [{
        file: fileName,
        action: "modified",
        additions: Math.max(0, newLines - oldLines),
        deletions: Math.max(0, oldLines - newLines),
      }],
    });

    await repository.save();

    res.status(200).json({
      success: true,
      message: "File updated successfully!",
      file: repository.content[fileIndex],
      repository,
    });
  } catch (err) {
    console.error("Error updating file:", err.message);
    res.status(500).json({ error: "Server error while updating file" });
  }
}

// Delete file from repository
async function deleteFileFromRepository(req, res) {
  const { repositoryId, fileName } = req.params;
  const { commitMessage } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const fileIndex = repository.content.findIndex(file => file.name === fileName);
    if (fileIndex === -1) {
      return res.status(404).json({ error: "File not found!" });
    }

    const deletedFile = repository.content[fileIndex];
    const deletedLines = deletedFile.content.split('\n').length;

    // Remove file
    repository.content.splice(fileIndex, 1);

    // Add commit
    const commitId = generateCommitId();
    repository.commits.push({
      id: commitId,
      message: commitMessage || `Delete ${fileName}`,
      author: repository.owner,
      timestamp: new Date(),
      changes: [{
        file: fileName,
        action: "deleted",
        additions: 0,
        deletions: deletedLines,
      }],
    });

    await repository.save();

    res.status(200).json({
      success: true,
      message: "File deleted successfully!",
      deletedFile,
      repository,
    });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res.status(500).json({ error: "Server error while deleting file" });
  }
}

// Get file content
async function getFileContent(req, res) {
  const { repositoryId, fileName } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const file = repository.content.find(file => file.name === fileName);
    if (!file) {
      return res.status(404).json({ error: "File not found!" });
    }

    res.status(200).json({
      success: true,
      file,
    });
  } catch (err) {
    console.error("Error getting file:", err.message);
    res.status(500).json({ error: "Server error while getting file" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
  addFileToRepository,
  updateFileInRepository,
  deleteFileFromRepository,
  getFileContent,
};
