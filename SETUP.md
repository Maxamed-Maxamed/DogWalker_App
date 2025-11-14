# Development Setup Guide

## Local Configuration

### VS Code Settings

This project uses VS Code configuration split between:

1. **Shared Settings** (`.vscode/settings.json`)
   - Committed to Git
   - Contains workspace-wide editor settings and code formatting rules

2. **Local Settings** (`.vscode/settings.local.json`)
   - **NOT committed to Git** (ignored by `.gitignore`)
   - Contains machine-specific settings that should not be shared
   - Includes CodeQL pack locations and GitHub Copilot MCP server endpoints

### Setting Up Local Configuration

#### Option 1: Auto-Setup (Recommended)
If you're working on this project for the first time:

```bash
# Create .vscode/settings.local.json with required dev-only settings
cp .vscode/settings.local.example.json .vscode/settings.local.json

# Edit the file with your local paths
code .vscode/settings.local.json
```

#### Option 2: Manual Setup
Create `.vscode/settings.local.json` with your machine-specific settings:

```json
{
  "codeQL.createQuery.qlPackLocation": "/path/to/your/local/DogWalker",
  "github.copilot.mcp.servers": {
    "clear-thought": {
      "type": "http",
      "url": "http://localhost:6969/mcp"
    }
  }
}
```

### CodeQL Configuration

If you're working with CodeQL:

1. Set the `codeQL.createQuery.qlPackLocation` in `.vscode/settings.local.json` to your local DogWalker project path
2. This path is machine-specific and must not be committed to Git

### GitHub Copilot MCP Servers

To enable local MCP servers for GitHub Copilot:

1. Ensure your MCP server is running locally (default: `http://localhost:6969/mcp`)
2. Update the URL in `.vscode/settings.local.json` to match your server endpoint
3. This localhost development endpoint must not be committed to Git

## Important Notes

- ⚠️ **Never commit** `.vscode/settings.local.json` to Git
- ✅ The file is already in `.gitignore`
- ✅ It's safe to create and modify locally without affecting other developers
- 🔄 Each developer should set up their own local configuration file

## Troubleshooting

### VS Code Settings Not Taking Effect
1. Verify `.vscode/settings.local.json` exists
2. Reload VS Code window (Cmd+Shift+P → "Developer: Reload Window")
3. Check that the JSON is valid (use VS Code's JSON validation)

### CodeQL Not Finding Pack
1. Update `codeQL.createQuery.qlPackLocation` to the absolute path on your machine
2. Ensure the path points to the DogWalker project root
3. Use forward slashes or properly escape backslashes in JSON

### MCP Server Connection Issues
1. Verify your MCP server is running on `localhost:6969`
2. Check firewall and port availability
3. Update the URL in `.vscode/settings.local.json` if using a different port
4. Reload VS Code to apply changes

## Contributing

When adding new developer-only settings or machine-specific configurations:
1. Add them to `.vscode/settings.local.json` template docs
2. Never commit machine-specific paths or localhost URLs to `.vscode/settings.json`
3. Use relative paths or environment variables when possible
4. Document the required setup in this file
