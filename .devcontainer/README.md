# Dev Container Setup

This project includes a VS Code/Cursor dev container configuration for consistent development environments.

## What's Included

- **Node.js 20** (LTS)
- **npm** (comes with Node.js)
- **Vercel CLI** (installed globally via postCreateCommand)
- **Git** (for version control)
- **Vue.js extensions** (Volar, ESLint, Prettier)

## Getting Started

1. **Open in Dev Container**:
   - In VS Code/Cursor: Press `F1` → "Dev Containers: Reopen in Container"
   - Or use the command palette: "Reopen in Container"

2. **Wait for Setup**:
   - The container will build automatically
   - Dependencies will install via `npm install`
   - Vercel CLI will be installed globally

3. **Set Up Environment Variables**:
   - Create `.env.local` in the project root:
     ```
     ANTHROPIC_API_KEY=your_api_key_here
     ```

4. **Start Development**:
   ```bash
   npm run dev:api
   ```

## Port Forwarding

Ports `3000` and `3001` are automatically forwarded, so you can access:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/api/*`

## Notes

- The container runs as the `node` user (non-root)
- Your project files are mounted into `/workspace`
- Changes made inside the container persist to your local filesystem
- The `.env.local` file should be created manually (it's gitignored)

