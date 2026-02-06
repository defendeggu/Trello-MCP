# 🎯 Trello MCP Server

Connects Claude directly to Trello – no middleware, no detours. 🚀

```
Claude Code / Claude Desktop  --MCP-->  MCP-Server  --API-->  Trello
```

## 🛠️ Available Tools

| Tool | Description |
|------|-------------|
| `trello_list_boards` | 📋 List all boards |
| `trello_list_lists` | 📝 Get lists from a board |
| `trello_list_cards` | 🃏 Get cards from a list |
| `trello_get_card` | 🔍 Get card details |
| `trello_create_card` | ✨ Create a new card |
| `trello_update_card` | ✏️ Update a card |
| `trello_move_card` | ↔️ Move a card to another list |
| `trello_add_comment` | 💬 Add a comment to a card |

## ⚡ Setup

### 1. 🔑 Get your Trello API Key and Token

1. Go to https://trello.com/power-ups/admin
2. Click "New" (or select an existing Power-Up)
3. Under "API Key" you'll find your **API Key**
4. Click the "manually generate a Token" link next to the API Key
5. Grant access – you'll receive your **API Token** 🎉

### 2. 📦 Install the MCP Server

```bash
cd mcp-server
npm install
```

### 3. 🔧 Configure Environment

Create a `.env` file in the `mcp-server/` directory:

```
TRELLO_API_KEY=your-api-key
TRELLO_API_TOKEN=your-api-token
```

### 4. 🖥️ Configure Claude Code

The `.mcp.json` file in the project root contains the MCP configuration. If needed, set your credentials in `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "trello": {
      "env": {
        "TRELLO_API_KEY": "your-api-key",
        "TRELLO_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### 5. 🔄 Restart

Restart Claude Code so the MCP server gets loaded. After that, the Trello tools are available right away! 🎊

## 🖥️ Claude Desktop Setup

Want to use the MCP server with **Claude Desktop** on another PC? 👉 See [CLAUDE-DESKTOP-SETUP.md](CLAUDE-DESKTOP-SETUP.md)

## 🧪 Testing

Test the Trello API directly:

```bash
curl -s "https://api.trello.com/1/members/me/boards?key=YOUR_API_KEY&token=YOUR_API_TOKEN"
```

Or simply ask Claude:

> *"Show me all my Trello boards"* 💬

## 📋 Prerequisites

- ✅ Node.js >= 18
- ✅ Trello account with API access
- ✅ Claude Code or Claude Desktop
