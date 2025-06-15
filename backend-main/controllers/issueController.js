const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description, repository, status } = req.body;

  try {
    const issue = new Issue({
      title,
      description,
      repository,
      status: status || "open"
    });

    const result = await issue.save();

    res.status(201).json({
      message: "Issue created successfully!",
      issueID: result._id,
      issue: result
    });
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json(issue, { message: "Issue updated" });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find({}).populate('repository');

    if (!issues || issues.length === 0) {
      return res.status(200).json({ message: "No issues found", issues: [] });
    }
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getIssuesByRepository(req, res) {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues || issues.length === 0) {
      return res.status(200).json({ message: "No issues found", issues: [] });
    }
    res.status(200).json({ issues });
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssuesByRepository,
  getIssueById,
};
