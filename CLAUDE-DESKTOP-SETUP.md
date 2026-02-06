# MCP-Server mit Claude Desktop verwenden

## 1. MCP-Server auf den anderen PC kopieren

Den `mcp-server/`-Ordner auf den anderen PC kopieren und dort die Dependencies installieren:

```bash
cd mcp-server
npm install
```

## 2. `.env`-Datei anlegen

Im `mcp-server/`-Ordner eine `.env` mit deinen Trello-Credentials erstellen:

```
TRELLO_API_KEY=dein-api-key
TRELLO_API_TOKEN=dein-api-token
```

Credentials erhältst du unter: https://trello.com/power-ups/admin

## 3. Claude Desktop konfigurieren

Die Datei `claude_desktop_config.json` bearbeiten:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Folgenden Inhalt einfügen (Pfad anpassen):

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/voller/pfad/zum/mcp-server/index.js"],
      "env": {
        "TRELLO_API_KEY": "dein-api-key",
        "TRELLO_API_TOKEN": "dein-api-token"
      }
    }
  }
}
```

> **Tipp:** Du kannst die Credentials entweder in der `.env`-Datei *oder* direkt im `env`-Block der Config angeben - beides funktioniert.

## 4. Claude Desktop neu starten

Nach dem Speichern Claude Desktop neu starten. Der Trello-MCP sollte dann als Tool verfügbar sein.

## Hinweis

Da der Server via **stdio** kommuniziert, muss er lokal auf dem jeweiligen PC laufen. Wenn du ihn remote nutzen willst (ohne den Code zu kopieren), bräuchtest du einen HTTP/SSE-Transport - das wäre eine Erweiterung des aktuellen Servers.
