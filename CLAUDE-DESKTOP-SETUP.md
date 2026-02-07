# Using the MCP Server with Claude Desktop

## 1. Copy the MCP Server to your PC

Copy the `mcp-server/` folder to your PC and install the dependencies:

```bash
cd mcp-server
npm install
```

## 2. Create a `.env` file

Create a `.env` file in the `mcp-server/` directory with your Trello credentials:

```
TRELLO_API_KEY=your-api-key
TRELLO_API_TOKEN=your-api-token
```

You can get your credentials at: https://trello.com/power-ups/admin

## 3. Configure Claude Desktop

Edit the `claude_desktop_config.json` file:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the following configuration (adjust the path):

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/full/path/to/mcp-server/index.js"],
      "env": {
        "TRELLO_API_KEY": "your-api-key",
        "TRELLO_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

> **Tip:** You can provide credentials either in the `.env` file *or* directly in the `env` block of the config — both work.

## 4. Restart Claude Desktop

After saving, restart Claude Desktop. The Trello MCP tools should then be available.

## Note

Since the server communicates via **stdio**, it must run locally on each PC. If you want to use it remotely (without copying the code), you would need an HTTP/SSE transport — that would be an extension of the current server.
