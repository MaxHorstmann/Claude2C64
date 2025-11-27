# Claude2C64 🖥️

Experimental project to generate Commodore 64 BASIC programs using Claude AI.

Try it out: https://claude2-c64.vercel.app/

## Features

- Web-based interface for prompting Claude to generate C64 BASIC code
- Real-time code generation with authentic C64 styling
- Example prompts to get you started
- Copy-to-clipboard functionality for easy transfer to C64 emulators

## Getting Started

### Option 1: Using Dev Container (Recommended)

If you're using VS Code or Cursor, you can use the included dev container:

1. Open the project in VS Code/Cursor
2. Press `F1` → "Dev Containers: Reopen in Container"
3. Wait for the container to build and dependencies to install
4. Create `.env.local` with your `ANTHROPIC_API_KEY`
5. Run `npm run dev:api`

The dev container includes Node.js, npm, and Vercel CLI pre-installed.

### Option 2: Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel CLI (for API development): `npm install -g vercel`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MaxHorstmann/Claude2C64.git
cd Claude2C64
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your Anthropic API key:
```bash
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.local
```

4. Start the development server:
```bash
# For frontend + API together
npm run dev:api

# Or just frontend (API won't work)
npm run dev
```

5. Open your browser to `http://localhost:3000`

## Usage

1. Enter a description of the C64 program you want to create
2. Click "Generate BASIC Code" 
3. Copy the generated code and paste it into your favorite C64 emulator
4. Run and enjoy your AI-generated retro program!

## Example Prompts

- "Create a program that displays a rainbow effect on the screen"
- "Make a simple number guessing game"
- "Generate a moving text animation"
- "Create a checkerboard pattern using character graphics"

## Development Roadmap

- [x] Basic Vue.js frontend with C64 styling
- [x] Mock code generation for testing
- [ ] Integrate with Anthropic Claude API
- [ ] Add backend service for API key management
- [ ] Support for more complex C64 programming patterns
- [ ] Integration with C64 emulators
- [ ] Code validation and syntax checking
- [ ] Save/load generated programs

## Tech Stack

- **Frontend**: Vue.js 3 with Vite
- **Styling**: CSS with C64-inspired color scheme
- **Future**: Node.js backend for Claude API integration

## Contributing

This is an experimental project. Feel free to fork and experiment!

## License

MIT License - see LICENSE file for details.
