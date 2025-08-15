# Claude2C64 🖥️

Experimental project to generate Commodore 64 BASIC programs using Claude AI.

Try it out: https://claude2-c64.vercel.app/

## Features

- Web-based interface for prompting Claude to generate C64 BASIC code
- Real-time code generation with authentic C64 styling
- Example prompts to get you started
- Copy-to-clipboard functionality for easy transfer to C64 emulators

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

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
