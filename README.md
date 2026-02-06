# 🎯 Trello MCP Server

Verbindet Claude direkt mit Trello – ohne Middleware, ohne Umwege. 🚀

```
Claude Code / Claude Desktop  --MCP-->  MCP-Server  --API-->  Trello
```

## 🛠️ Verfügbare Tools

| Tool | Beschreibung |
|------|-------------|
| `trello_list_boards` | 📋 Alle Boards auflisten |
| `trello_list_lists` | 📝 Listen eines Boards abfragen |
| `trello_list_cards` | 🃏 Karten einer Liste abfragen |
| `trello_get_card` | 🔍 Kartendetails abrufen |
| `trello_create_card` | ✨ Neue Karte erstellen |
| `trello_update_card` | ✏️ Karte aktualisieren |
| `trello_move_card` | ↔️ Karte verschieben |
| `trello_add_comment` | 💬 Kommentar schreiben |

## ⚡ Setup

### 1. 🔑 Trello API Key und Token besorgen

1. Gehe zu https://trello.com/power-ups/admin
2. Klicke auf "Neu" (oder wähle ein bestehendes Power-Up)
3. Unter "API-Schlüssel" findest du deinen **API Key**
4. Klicke neben dem API Key auf den Link "Token manuell generieren"
5. Erlaube den Zugriff – du erhältst deinen **API Token** 🎉

### 2. 📦 MCP Server installieren

```bash
cd mcp-server
npm install
```

### 3. 🔧 Environment konfigurieren

Erstelle eine `.env`-Datei im `mcp-server/`-Ordner:

```
TRELLO_API_KEY=dein-api-key
TRELLO_API_TOKEN=dein-api-token
```

### 4. 🖥️ Claude Code konfigurieren

Die Datei `.mcp.json` im Projektordner enthält die MCP-Konfiguration. Passe bei Bedarf die Credentials in `.claude/settings.local.json` an:

```json
{
  "mcpServers": {
    "trello": {
      "env": {
        "TRELLO_API_KEY": "dein-api-key",
        "TRELLO_API_TOKEN": "dein-api-token"
      }
    }
  }
}
```

### 5. 🔄 Neu starten

Starte Claude Code neu, damit der MCP-Server geladen wird. Danach stehen die Trello-Tools direkt zur Verfügung! 🎊

## 🖥️ Claude Desktop Setup

Du möchtest den MCP-Server mit **Claude Desktop** auf einem anderen PC nutzen? 👉 Siehe [CLAUDE-DESKTOP-SETUP.md](CLAUDE-DESKTOP-SETUP.md)

## 🧪 Testen

Trello API direkt testen:

```bash
curl -s "https://api.trello.com/1/members/me/boards?key=DEIN_API_KEY&token=DEIN_API_TOKEN"
```

Oder einfach in Claude fragen:

> *"Zeig mir alle meine Trello-Boards"* 💬

## 📋 Voraussetzungen

- ✅ Node.js >= 18
- ✅ Trello Account mit API-Zugang
- ✅ Claude Code oder Claude Desktop
