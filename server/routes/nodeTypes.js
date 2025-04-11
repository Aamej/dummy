const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Node type definitions
const nodeTypes = {
  triggers: [
    {
      id: 'webhook',
      name: 'Webhook',
      description: 'Trigger a workflow when a webhook is called',
      category: 'trigger',
      configSchema: {
        properties: {
          endpoint: {
            type: 'string',
            description: 'Webhook endpoint path',
          },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'DELETE'],
            default: 'POST',
            description: 'HTTP method',
          },
        },
        required: ['endpoint'],
      },
    },
    {
      id: 'schedule',
      name: 'Schedule',
      description: 'Trigger a workflow on a schedule',
      category: 'trigger',
      configSchema: {
        properties: {
          schedule: {
            type: 'string',
            description: 'Cron expression',
          },
          timezone: {
            type: 'string',
            description: 'Timezone',
          },
        },
        required: ['schedule'],
      },
    },
    {
      id: 'event',
      name: 'Event',
      description: 'Trigger a workflow on an event',
      category: 'trigger',
      configSchema: {
        properties: {
          eventType: {
            type: 'string',
            description: 'Type of event to listen for',
          },
        },
        required: ['eventType'],
      },
    },
  ],
  actions: [
    {
      id: 'http',
      name: 'HTTP Request',
      description: 'Make an HTTP request',
      category: 'action',
      configSchema: {
        properties: {
          url: {
            type: 'string',
            description: 'URL to request',
          },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'DELETE'],
            default: 'GET',
            description: 'HTTP method',
          },
          headers: {
            type: 'object',
            description: 'HTTP headers',
          },
          body: {
            type: 'object',
            description: 'Request body (for POST/PUT)',
          },
        },
        required: ['url', 'method'],
      },
    },
    {
      id: 'email',
      name: 'Send Email',
      description: 'Send an email',
      category: 'action',
      configSchema: {
        properties: {
          to: {
            type: 'string',
            description: 'Recipient email address',
          },
          subject: {
            type: 'string',
            description: 'Email subject',
          },
          body: {
            type: 'string',
            description: 'Email body',
          },
        },
        required: ['to', 'subject', 'body'],
      },
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Interact with a database',
      category: 'action',
      configSchema: {
        properties: {
          operation: {
            type: 'string',
            enum: ['create', 'read', 'update', 'delete'],
            description: 'Database operation',
          },
          collection: {
            type: 'string',
            description: 'Database collection/table',
          },
          query: {
            type: 'object',
            description: 'Query parameters',
          },
          data: {
            type: 'object',
            description: 'Data to create/update',
          },
        },
        required: ['operation', 'collection'],
      },
    },
  ],
  conditions: [
    {
      id: 'if',
      name: 'If Condition',
      description: 'Branch based on a condition',
      category: 'condition',
      configSchema: {
        properties: {
          field: {
            type: 'string',
            description: 'Field to evaluate',
          },
          operator: {
            type: 'string',
            enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'],
            description: 'Comparison operator',
          },
          value: {
            type: 'string',
            description: 'Value to compare against',
          },
        },
        required: ['field', 'operator', 'value'],
      },
    },
    {
      id: 'switch',
      name: 'Switch',
      description: 'Multiple branches based on a value',
      category: 'condition',
      configSchema: {
        properties: {
          field: {
            type: 'string',
            description: 'Field to evaluate',
          },
          cases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  description: 'Case value',
                },
                label: {
                  type: 'string',
                  description: 'Case label',
                },
              },
              required: ['value', 'label'],
            },
            description: 'Switch cases',
          },
          default: {
            type: 'boolean',
            description: 'Include default case',
            default: true,
          },
        },
        required: ['field', 'cases'],
      },
    },
  ],
  transformers: [
    {
      id: 'transform',
      name: 'Transform',
      description: 'Transform data format',
      category: 'transformer',
      configSchema: {
        properties: {
          transformations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                source: {
                  type: 'string',
                  description: 'Source field',
                },
                target: {
                  type: 'string',
                  description: 'Target field',
                },
                transformation: {
                  type: 'string',
                  enum: ['copy', 'uppercase', 'lowercase', 'number', 'boolean', 'date'],
                  description: 'Transformation type',
                },
              },
              required: ['source', 'target', 'transformation'],
            },
          },
        },
        required: ['transformations'],
      },
    },
    {
      id: 'filter',
      name: 'Filter',
      description: 'Filter data',
      category: 'transformer',
      configSchema: {
        properties: {
          conditions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Field to filter on',
                },
                operator: {
                  type: 'string',
                  enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'],
                  description: 'Comparison operator',
                },
                value: {
                  type: 'string',
                  description: 'Value to compare against',
                },
              },
              required: ['field', 'operator', 'value'],
            },
          },
          combinator: {
            type: 'string',
            enum: ['and', 'or'],
            default: 'and',
            description: 'How to combine multiple conditions',
          },
        },
        required: ['conditions'],
      },
    },
    {
      id: 'map',
      name: 'Map',
      description: 'Map data to a new structure',
      category: 'transformer',
      configSchema: {
        properties: {
          mapping: {
            type: 'object',
            description: 'Field mapping configuration',
          },
        },
        required: ['mapping'],
      },
    },
  ],
};

// @route   GET /api/node-types
// @desc    Get all available node types
// @access  Private
router.get('/', auth, (req, res) => {
  res.json(nodeTypes);
});

module.exports = router;
