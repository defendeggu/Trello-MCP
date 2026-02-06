# Trello <-> N8N <-> Claude Integration

Verbindet Claude Code mit Trello ueber N8N als Middleware.

```
Claude Code  --MCP-->  MCP-Server  --HTTP-->  N8N Webhook  --API-->  Trello
```

## Verfuegbare Tools

| Tool | Beschreibung |
|------|-------------|
| `trello_list_boards` | Alle Boards auflisten |
| `trello_list_lists` | Listen eines Boards abfragen |
| `trello_list_cards` | Karten einer Liste abfragen |
| `trello_get_card` | Kartendetails abrufen |
| `trello_create_card` | Neue Karte erstellen |
| `trello_update_card` | Karte aktualisieren |
| `trello_move_card` | Karte verschieben |
| `trello_add_comment` | Kommentar schreiben |

## Setup

### 1. Trello API Key und Token besorgen

1. Gehe zu https://trello.com/power-ups/admin
2. Klicke auf "Neu" (oder waehle ein bestehendes Power-Up)
3. Unter "API-Schluessel" findest du deinen **API Key**
4. Klicke neben dem API Key auf den Link "Token manuell generieren"
5. Erlaube den Zugriff - du erhaeltst deinen **API Token**

### 2. N8N Workflow importieren

1. Oeffne N8N unter http://localhost:5678
2. Gehe zu "Workflows" und klicke auf das `+` Symbol
3. Klicke auf das Menue (drei Punkte) -> "Workflow aus Datei importieren"
4. Waehle `n8n-workflows/trello-integration.json`
5. **Aktiviere** den Workflow (Toggle oben rechts)

Der Workflow erstellt automatisch einen Webhook unter:
`http://localhost:5678/webhook/trello`

### 3. MCP Server installieren

```bash
cd mcp-server
npm install
```

### 4. Claude Code konfigurieren

Bearbeite `.claude/settings.local.json` und ersetze die Platzhalter:

```json
{
  "mcpServers": {
    "trello": {
      "env": {
        "TRELLO_API_KEY": "dein-echter-api-key",
        "TRELLO_API_TOKEN": "dein-echter-api-token"
      }
    }
  }
}
```

### 5. Claude Code neu starten

Starte Claude Code neu, damit der MCP-Server geladen wird. Danach stehen die Trello-Tools direkt in Claude zur Verfuegung.

## Testen

Webhook manuell testen:

```bash
curl -X POST http://localhost:5678/webhook/trello \
  -H "Content-Type: application/json" \
  -d '{
    "action": "list_boards",
    "params": {},
    "apiKey": "DEIN_API_KEY",
    "apiToken": "DEIN_API_TOKEN"
  }'
```

## Voraussetzungen

- N8N >= 1.0 (lokal laufend)
- Node.js >= 18
- Trello Account mit API-Zugang
