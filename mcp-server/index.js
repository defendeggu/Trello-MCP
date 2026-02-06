import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/trello';
const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_API_TOKEN = process.env.TRELLO_API_TOKEN;

if (!TRELLO_API_KEY || !TRELLO_API_TOKEN) {
  console.error(
    'Error: TRELLO_API_KEY and TRELLO_API_TOKEN environment variables are required.'
  );
  process.exit(1);
}

const server = new Server(
  { name: 'trello-n8n', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const tools = [
  {
    name: 'trello_list_boards',
    description: 'List all Trello boards accessible to the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'trello_list_lists',
    description: 'List all lists on a specific Trello board',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: { type: 'string', description: 'The ID of the Trello board' },
      },
      required: ['boardId'],
    },
  },
  {
    name: 'trello_list_cards',
    description: 'List all cards in a specific Trello list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: { type: 'string', description: 'The ID of the Trello list' },
      },
      required: ['listId'],
    },
  },
  {
    name: 'trello_get_card',
    description: 'Get detailed information about a specific Trello card',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: { type: 'string', description: 'The ID of the Trello card' },
      },
      required: ['cardId'],
    },
  },
  {
    name: 'trello_create_card',
    description: 'Create a new card in a Trello list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: {
          type: 'string',
          description: 'The ID of the list to create the card in',
        },
        name: { type: 'string', description: 'The name/title of the card' },
        description: {
          type: 'string',
          description: 'The description of the card',
        },
        due: {
          type: 'string',
          description: 'Due date in ISO 8601 format (e.g. 2025-12-31)',
        },
        pos: {
          type: 'string',
          description: 'Position: "top", "bottom", or a positive number',
        },
      },
      required: ['listId', 'name'],
    },
  },
  {
    name: 'trello_update_card',
    description:
      'Update an existing Trello card (name, description, due date, archive status)',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: { type: 'string', description: 'The ID of the card to update' },
        name: { type: 'string', description: 'New name for the card' },
        description: {
          type: 'string',
          description: 'New description for the card',
        },
        due: {
          type: 'string',
          description:
            'New due date in ISO 8601 format, or null to remove',
        },
        closed: {
          type: 'boolean',
          description: 'Set to true to archive the card',
        },
      },
      required: ['cardId'],
    },
  },
  {
    name: 'trello_move_card',
    description: 'Move a Trello card to a different list',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: { type: 'string', description: 'The ID of the card to move' },
        listId: {
          type: 'string',
          description: 'The ID of the destination list',
        },
        pos: {
          type: 'string',
          description:
            'Position in the new list: "top", "bottom", or a number',
        },
      },
      required: ['cardId', 'listId'],
    },
  },
  {
    name: 'trello_add_comment',
    description: 'Add a comment to a Trello card',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: {
          type: 'string',
          description: 'The ID of the card to comment on',
        },
        text: { type: 'string', description: 'The comment text' },
      },
      required: ['cardId', 'text'],
    },
  },
];

const toolActionMap = {
  trello_list_boards: 'list_boards',
  trello_list_lists: 'list_lists',
  trello_list_cards: 'list_cards',
  trello_get_card: 'get_card',
  trello_create_card: 'create_card',
  trello_update_card: 'update_card',
  trello_move_card: 'move_card',
  trello_add_comment: 'add_comment',
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const action = toolActionMap[name];
  if (!action) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        params: args || {},
        apiKey: TRELLO_API_KEY,
        apiToken: TRELLO_API_TOKEN,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Trello API error: ${JSON.stringify(result.error, null, 2)}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        { type: 'text', text: `Error calling N8N webhook: ${error.message}` },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
