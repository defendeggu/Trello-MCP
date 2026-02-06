import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_API_TOKEN = process.env.TRELLO_API_TOKEN;
const TRELLO_BASE_URL = 'https://api.trello.com/1';

if (!TRELLO_API_KEY || !TRELLO_API_TOKEN) {
  console.error(
    'Error: TRELLO_API_KEY and TRELLO_API_TOKEN environment variables are required.'
  );
  process.exit(1);
}

async function callTrello(method, path, body) {
  const url = new URL(`${TRELLO_BASE_URL}${path}`);
  url.searchParams.set('key', TRELLO_API_KEY);
  url.searchParams.set('token', TRELLO_API_TOKEN);

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Trello API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

const server = new Server(
  { name: 'trello-mcp', version: '1.1.0' },
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

async function handleToolCall(name, args) {
  switch (name) {
    case 'trello_list_boards':
      return await callTrello('GET', '/members/me/boards');

    case 'trello_list_lists':
      return await callTrello('GET', `/boards/${args.boardId}/lists`);

    case 'trello_list_cards':
      return await callTrello('GET', `/lists/${args.listId}/cards`);

    case 'trello_get_card':
      return await callTrello('GET', `/cards/${args.cardId}`);

    case 'trello_create_card': {
      const body = { idList: args.listId, name: args.name };
      if (args.description) body.desc = args.description;
      if (args.due) body.due = args.due;
      if (args.pos) body.pos = args.pos;
      return await callTrello('POST', '/cards', body);
    }

    case 'trello_update_card': {
      const body = {};
      if (args.name !== undefined) body.name = args.name;
      if (args.description !== undefined) body.desc = args.description;
      if (args.due !== undefined) body.due = args.due;
      if (args.closed !== undefined) body.closed = args.closed;
      return await callTrello('PUT', `/cards/${args.cardId}`, body);
    }

    case 'trello_move_card': {
      const body = { idList: args.listId };
      if (args.pos) body.pos = args.pos;
      return await callTrello('PUT', `/cards/${args.cardId}`, body);
    }

    case 'trello_add_comment':
      return await callTrello('POST', `/cards/${args.cardId}/actions/comments`, {
        text: args.text,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleToolCall(name, args || {});
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        { type: 'text', text: `Error: ${error.message}` },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
