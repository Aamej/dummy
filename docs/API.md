# Flow Builder API Documentation

This document provides detailed information about the REST API endpoints available in the Flow Builder application.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

For production, this would be your deployed API URL.

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Tokens) for authentication.

### Authentication Header

Include the JWT token in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

To obtain a JWT token, use the login endpoint.

## API Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:
```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get current user

```
GET /auth/me
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Flows

#### List all flows

```
GET /flows
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

Response:
```json
{
  "flows": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Email notification workflow",
      "description": "Send email notifications when new data arrives",
      "createdAt": "2023-06-15T10:00:00.000Z",
      "updatedAt": "2023-06-16T15:30:00.000Z"
    },
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Data processing workflow",
      "description": "Process and transform incoming data",
      "createdAt": "2023-06-14T09:00:00.000Z",
      "updatedAt": "2023-06-14T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

#### Get a specific flow

```
GET /flows/:id
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Email notification workflow",
  "description": "Send email notifications when new data arrives",
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "subtype": "webhook",
      "position": { "x": 100, "y": 100 },
      "data": {
        "endpoint": "/webhook/incoming-data",
        "method": "POST"
      }
    },
    {
      "id": "node-2",
      "type": "action",
      "subtype": "email",
      "position": { "x": 400, "y": 100 },
      "data": {
        "to": "recipient@example.com",
        "subject": "New data received",
        "body": "New data has been received from the webhook."
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "sourceHandle": "output",
      "targetHandle": "input"
    }
  ],
  "createdAt": "2023-06-15T10:00:00.000Z",
  "updatedAt": "2023-06-16T15:30:00.000Z"
}
```

#### Create a new flow

```
POST /flows
```

Request body:
```json
{
  "name": "New workflow",
  "description": "Description of the new workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "subtype": "webhook",
      "position": { "x": 100, "y": 100 },
      "data": {
        "endpoint": "/webhook/incoming-data",
        "method": "POST"
      }
    },
    {
      "id": "node-2",
      "type": "action",
      "subtype": "email",
      "position": { "x": 400, "y": 100 },
      "data": {
        "to": "recipient@example.com",
        "subject": "New data received",
        "body": "New data has been received from the webhook."
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "sourceHandle": "output",
      "targetHandle": "input"
    }
  ]
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c87",
  "name": "New workflow",
  "description": "Description of the new workflow",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2023-06-17T10:00:00.000Z",
  "updatedAt": "2023-06-17T10:00:00.000Z"
}
```

#### Update an existing flow

```
PUT /flows/:id
```

Request body:
```json
{
  "name": "Updated workflow name",
  "description": "Updated description",
  "nodes": [...],
  "edges": [...]
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Updated workflow name",
  "description": "Updated description",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2023-06-15T10:00:00.000Z",
  "updatedAt": "2023-06-17T11:30:00.000Z"
}
```

#### Delete a flow

```
DELETE /flows/:id
```

Response:
```json
{
  "message": "Flow deleted successfully"
}
```

### Node Types

#### Get available node types

```
GET /node-types
```

Response:
```json
{
  "triggers": [
    {
      "id": "webhook",
      "name": "Webhook",
      "description": "Trigger a workflow when a webhook is called",
      "category": "trigger",
      "configSchema": {
        "properties": {
          "endpoint": {
            "type": "string",
            "description": "Webhook endpoint path"
          },
          "method": {
            "type": "string",
            "enum": ["GET", "POST", "PUT", "DELETE"],
            "default": "POST",
            "description": "HTTP method"
          }
        },
        "required": ["endpoint"]
      }
    },
    {
      "id": "schedule",
      "name": "Schedule",
      "description": "Trigger a workflow on a schedule",
      "category": "trigger",
      "configSchema": {
        "properties": {
          "schedule": {
            "type": "string",
            "description": "Cron expression"
          },
          "timezone": {
            "type": "string",
            "description": "Timezone"
          }
        },
        "required": ["schedule"]
      }
    }
  ],
  "actions": [
    {
      "id": "email",
      "name": "Send Email",
      "description": "Send an email",
      "category": "action",
      "configSchema": {
        "properties": {
          "to": {
            "type": "string",
            "description": "Recipient email address"
          },
          "subject": {
            "type": "string",
            "description": "Email subject"
          },
          "body": {
            "type": "string",
            "description": "Email body"
          }
        },
        "required": ["to", "subject", "body"]
      }
    },
    {
      "id": "http",
      "name": "HTTP Request",
      "description": "Make an HTTP request",
      "category": "action",
      "configSchema": {
        "properties": {
          "url": {
            "type": "string",
            "description": "URL to request"
          },
          "method": {
            "type": "string",
            "enum": ["GET", "POST", "PUT", "DELETE"],
            "default": "GET",
            "description": "HTTP method"
          },
          "headers": {
            "type": "object",
            "description": "HTTP headers"
          },
          "body": {
            "type": "object",
            "description": "Request body (for POST/PUT)"
          }
        },
        "required": ["url", "method"]
      }
    }
  ],
  "conditions": [
    {
      "id": "condition",
      "name": "Condition",
      "description": "Branch based on a condition",
      "category": "condition",
      "configSchema": {
        "properties": {
          "field": {
            "type": "string",
            "description": "Field to evaluate"
          },
          "operator": {
            "type": "string",
            "enum": ["equals", "not_equals", "contains", "greater_than", "less_than"],
            "description": "Comparison operator"
          },
          "value": {
            "type": "string",
            "description": "Value to compare against"
          }
        },
        "required": ["field", "operator", "value"]
      }
    }
  ],
  "transformers": [
    {
      "id": "transform",
      "name": "Transform Data",
      "description": "Transform data format",
      "category": "transformer",
      "configSchema": {
        "properties": {
          "transformations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "source": {
                  "type": "string",
                  "description": "Source field"
                },
                "target": {
                  "type": "string",
                  "description": "Target field"
                },
                "transformation": {
                  "type": "string",
                  "enum": ["copy", "uppercase", "lowercase", "number", "boolean", "date"],
                  "description": "Transformation type"
                }
              },
              "required": ["source", "target", "transformation"]
            }
          }
        },
        "required": ["transformations"]
      }
    }
  ]
}
```

## Error Responses

The API returns appropriate HTTP status codes and error messages for different error scenarios.

### Common Error Responses

#### Authentication Errors

```
401 Unauthorized
```

```json
{
  "error": "Authentication required"
}
```

#### Permission Errors

```
403 Forbidden
```

```json
{
  "error": "You do not have permission to access this resource"
}
```

#### Resource Not Found

```
404 Not Found
```

```json
{
  "error": "Resource not found"
}
```

#### Validation Errors

```
400 Bad Request
```

```json
{
  "error": "Validation error",
  "details": {
    "name": "Name is required",
    "nodes": "At least one trigger node is required"
  }
}
```

#### Server Errors

```
500 Internal Server Error
```

```json
{
  "error": "An unexpected error occurred"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are applied per user and are reset hourly.

Rate limit headers are included in API responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623938400
```

If you exceed the rate limit, you'll receive a 429 Too Many Requests response:

```
429 Too Many Requests
```

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```
