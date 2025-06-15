# VandalHub API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
VandalHub uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-06-14T10:30:00Z"
}
```

## Error Handling
Error responses include:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-06-14T10:30:00Z"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Repositories

#### Get All Repositories
```http
GET /repo/all
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `visibility` (optional): public | private

**Response:**
```json
{
  "success": true,
  "data": {
    "repositories": [
      {
        "_id": "repo_id",
        "name": "my-awesome-project",
        "description": "An awesome project",
        "visibility": true,
        "owner": "user_id",
        "createdAt": "2025-06-14T10:30:00Z",
        "updatedAt": "2025-06-14T10:30:00Z",
        "stars": 0,
        "forks": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### Get Repository by ID
```http
GET /repo/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "repo_id",
    "name": "my-awesome-project",
    "description": "An awesome project",
    "visibility": true,
    "owner": {
      "_id": "user_id",
      "username": "johndoe"
    },
    "content": [
      {
        "name": "README.md",
        "content": "# My Awesome Project",
        "type": "file"
      }
    ],
    "issues": ["issue_id_1", "issue_id_2"],
    "createdAt": "2025-06-14T10:30:00Z",
    "updatedAt": "2025-06-14T10:30:00Z"
  }
}
```

#### Create Repository
```http
POST /repo/create
```

**Request Body:**
```json
{
  "name": "my-new-project",
  "description": "A new project description",
  "visibility": true,
  "content": []
}
```

#### Update Repository
```http
PUT /repo/update/:id
```

**Request Body:**
```json
{
  "name": "updated-project-name",
  "description": "Updated description",
  "visibility": false,
  "content": [
    {
      "name": "README.md",
      "content": "# Updated README",
      "type": "file"
    }
  ]
}
```

#### Delete Repository
```http
DELETE /repo/delete/:id
```

#### Get User Repositories
```http
GET /repo/user/:userId
```

### Issues

#### Get All Issues
```http
GET /issue/all
```

**Query Parameters:**
- `status` (optional): open | closed
- `repository` (optional): Repository ID
- `assignee` (optional): User ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "issue_id",
      "title": "Bug in login form",
      "description": "The login form doesn't validate email properly",
      "status": "open",
      "repository": {
        "_id": "repo_id",
        "name": "my-project"
      },
      "creator": {
        "_id": "user_id",
        "username": "johndoe"
      },
      "assignee": null,
      "labels": ["bug", "frontend"],
      "createdAt": "2025-06-14T10:30:00Z",
      "updatedAt": "2025-06-14T10:30:00Z"
    }
  ]
}
```

#### Get Issue by ID
```http
GET /issue/:id
```

#### Create Issue
```http
POST /issue/create
```

**Request Body:**
```json
{
  "title": "New feature request",
  "description": "Add dark mode support",
  "repository": "repo_id",
  "labels": ["enhancement", "ui"]
}
```

#### Update Issue
```http
PUT /issue/update/:id
```

**Request Body:**
```json
{
  "title": "Updated issue title",
  "description": "Updated description",
  "status": "closed",
  "assignee": "user_id",
  "labels": ["bug", "resolved"]
}
```

#### Delete Issue
```http
DELETE /issue/delete/:id
```

#### Get Repository Issues
```http
GET /issue/repository/:repositoryId
```

### Users

#### Get User Profile
```http
GET /userProfile/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
      "name": "John Doe",
      "bio": "Full-stack developer",
      "location": "San Francisco, CA",
      "website": "https://johndoe.com",
      "avatar": "https://example.com/avatar.jpg",
      "status": {
        "emoji": "💻",
        "message": "Working on VandalHub",
        "busy": false
      }
    },
    "stats": {
      "repositories": 15,
      "followers": 42,
      "following": 18,
      "contributions": 234
    },
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Update User Profile
```http
PUT /userProfile/:userId
```

**Request Body:**
```json
{
  "profile": {
    "name": "John Doe",
    "bio": "Senior Full-stack Developer",
    "location": "New York, NY",
    "website": "https://johndoe.dev",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

#### Get User Repositories
```http
GET /user/:userId/repositories
```

#### Get User Issues
```http
GET /user/:userId/issues
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to:
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response includes pagination info:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Searching

Most list endpoints support filtering:

**Common filters:**
- `search`: Text search across relevant fields
- `sort`: Sort field (e.g., `createdAt`, `updatedAt`, `name`)
- `order`: Sort order (`asc` or `desc`)
- `status`: Filter by status
- `visibility`: Filter by visibility

**Example:**
```
GET /repo/all?search=react&sort=createdAt&order=desc&visibility=public
```

## WebSocket Events

VandalHub supports real-time updates via WebSocket:

**Connection:**
```javascript
const socket = io('http://localhost:3000');
```

**Events:**
- `repository:created` - New repository created
- `repository:updated` - Repository updated
- `issue:created` - New issue created
- `issue:updated` - Issue updated
- `user:online` - User came online
- `user:offline` - User went offline

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install vandalhub-sdk
```

```javascript
import VandalHub from 'vandalhub-sdk';

const client = new VandalHub({
  baseURL: 'http://localhost:3000',
  token: 'your-jwt-token'
});

// Get repositories
const repos = await client.repositories.getAll();

// Create issue
const issue = await client.issues.create({
  title: 'Bug report',
  description: 'Found a bug',
  repository: 'repo-id'
});
```

## Examples

### Complete Repository Workflow
```javascript
// 1. Create repository
const repo = await fetch('/repo/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    name: 'my-project',
    description: 'My awesome project',
    visibility: true
  })
});

// 2. Add files
await fetch(`/repo/update/${repo.id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    content: [
      {
        name: 'README.md',
        content: '# My Project\n\nAwesome project description',
        type: 'file'
      }
    ]
  })
});

// 3. Create issue
await fetch('/issue/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    title: 'Add tests',
    description: 'Need to add unit tests',
    repository: repo.id,
    labels: ['enhancement', 'testing']
  })
});
```
