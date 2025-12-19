# OpenMemory

OpenMemory is your personal memory layer for LLMs - private, portable, and open-source. Your memories live locally, giving you complete control over your data. Build AI applications with personalized memories while keeping your data secure.

![OpenMemory](https://github.com/user-attachments/assets/3c701757-ad82-4afa-bfbe-e049c2b4320b)

## Easy Setup

### Prerequisites
- Docker
- OpenAI API Key

You can quickly run OpenMemory by running the following command:

```bash
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | bash
```

You should set the `OPENAI_API_KEY` as a global environment variable:

```bash
export OPENAI_API_KEY=your_api_key
```

You can also set the `OPENAI_API_KEY` as a parameter to the script:

```bash
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | OPENAI_API_KEY=your_api_key bash
```

## Prerequisites

- Docker and Docker Compose
- Python 3.9+ (for backend development)
- Node.js (for frontend development)
- OpenAI API Key (required for LLM interactions, run `cp api/.env.example api/.env` then change **OPENAI_API_KEY** to yours)

## Quickstart

### 1. Set Up Environment Variables

Before running the project, you need to configure environment variables for both the API and the UI.

You can do this in one of the following ways:

- **Manually**:  
  Create a `.env` file in each of the following directories:
  - `/api/.env`
  - `/ui/.env`

- **Using `.env.example` files**:  
  Copy and rename the example files:

  ```bash
  cp api/.env.example api/.env
  cp ui/.env.example ui/.env
  ```

 - **Using Makefile** (if supported):  
    Run:
  
   ```bash
   make env
   ```
- #### Example `/api/.env`

```env
OPENAI_API_KEY=sk-xxx
USER=<user-id> # The User Id you want to associate the memories with 
```
- #### Example `/ui/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:8765
NEXT_PUBLIC_USER_ID=<user-id> # Same as the user id for environment variable in api
```

### 2. Build and Run the Project
You can run the project using the following two commands:
```bash
make build # builds the mcp server and ui
make up  # runs openmemory mcp server and ui
```

After running these commands, you will have:
- OpenMemory MCP server running at: http://localhost:8765 (API documentation available at http://localhost:8765/docs)
- OpenMemory UI running at: http://localhost:3000

#### UI not working on `localhost:3000`?

If the UI does not start properly on [http://localhost:3000](http://localhost:3000), try running it manually:

```bash
cd ui
pnpm install
pnpm dev
```

### MCP Client Setup

Use the following one step command to configure OpenMemory Local MCP to a client. The general command format is as follows:

```bash
npx @openmemory/install local http://localhost:8765/mcp/<client-name>/sse/<user-id> --client <client-name>
```

Replace `<client-name>` with the desired client name and `<user-id>` with the value specified in your environment variables.

### Optimizing MCP Connection for Cursor

For faster connection speeds and better stability in Cursor, it is recommended to use `supergateway` directly instead of `npx`.

1. **Install supergateway globally:**
   ```bash
   npm install -g supergateway
   ```

2. **Configure Cursor (`mcp.json`):**
   Update your MCP configuration to use the global `supergateway` command:
   ```json
   {
     "mcpServers": {
       "openmemory-local": {
         "command": "supergateway",
         "args": [
           "--sse",
           "http://localhost:8765/mcp/cursor/sse/default_user"
         ]
       }
     }
   }
   ```

   **Note:** Ensure your backend Docker container is running with `workers: 1` in `docker-compose.yml`. This is critical for SSE session stability when using proxies like supergateway.

### Pro Tips for Mem0 Usage

When adding memories to Mem0 (e.g., via the `openmemory-local` tool), please note:
- **Be Explicit**: Mem0 is designed to capture *user preferences and facts*. If you provide a generic statement like "Docker requires restart", Mem0 might ignore it.
- **Use "User" Context**: To force Mem0 to remember a fact or rule, phrase it as a user request or preference.
  - ❌ "Docker needs a restart." (Might be ignored)
  - ✅ "User requests to remember this DevOps rule: Docker needs a restart."

## Project Structure

- `api/` - Backend APIs + MCP server
- `ui/` - Frontend React application

## Contributing

We are a team of developers passionate about the future of AI and open-source software. With years of experience in both fields, we believe in the power of community-driven development and are excited to build tools that make AI more accessible and personalized.

We welcome all forms of contributions:
- Bug reports and feature requests
- Documentation improvements
- Code contributions
- Testing and feedback
- Community support

How to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b openmemory/feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin openmemory/feature/amazing-feature`)
5. Open a Pull Request

Join us in building the future of AI memory management! Your contributions help make OpenMemory better for everyone.
