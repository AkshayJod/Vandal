const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepositorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: [
    {
      name: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        enum: ["file", "folder"],
        default: "file",
      },
      path: {
        type: String,
        default: "",
      },
      size: {
        type: Number,
        default: 0,
      },
      lastModified: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  visibility: {
    type: Boolean,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
    default: "JavaScript",
  },
  topics: [
    {
      type: String,
    },
  ],
  readme: {
    type: String,
    default: "",
  },
  defaultBranch: {
    type: String,
    default: "main",
  },
  commits: [
    {
      id: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      changes: [
        {
          file: String,
          action: {
            type: String,
            enum: ["added", "modified", "deleted"],
          },
          additions: Number,
          deletions: Number,
        },
      ],
    },
  ],
}, { timestamps: true });

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;
