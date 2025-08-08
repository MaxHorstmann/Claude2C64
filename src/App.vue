<template>
  <div class="app">
    <header class="header">
      <h1>🖥️ Claude2C64</h1>
      <p>Generate Commodore 64 BASIC programs using AI</p>
    </header>

    <main class="main-content">
      <div class="prompt-section">
        <h2>Describe your C64 program:</h2>
        <textarea
          v-model="prompt"
          placeholder="Example: Create a program that displays a rainbow effect on the screen with moving text that says 'HELLO WORLD'"
          rows="4"
          class="prompt-input"
        ></textarea>
        
        <div class="button-group">
          <button 
            @click="generateCode" 
            :disabled="isGenerating || !prompt.trim()"
            class="generate-btn"
          >
            {{ isGenerating ? 'Generating...' : 'Generate BASIC Code' }}
          </button>
          <button 
            @click="clearAll" 
            class="clear-btn"
            :disabled="!prompt && !generatedCode"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="result-section" v-if="generatedCode || isGenerating">
        <h2>Generated C64 BASIC Code:</h2>
        <div class="code-container">
          <div v-if="isGenerating" class="loading">
            <div class="loading-spinner"></div>
            <p>Claude is generating your C64 BASIC program...</p>
          </div>
          <pre v-else class="code-output">{{ generatedCode }}</pre>
          <button 
            v-if="generatedCode && !isGenerating" 
            @click="copyToClipboard"
            class="copy-btn"
          >
            {{ copied ? 'Copied!' : 'Copy Code' }}
          </button>
        </div>
      </div>

      <div class="examples-section">
        <h2>Example Prompts:</h2>
        <div class="examples">
          <div 
            v-for="example in examples" 
            :key="example.title"
            class="example-card"
            @click="useExample(example.prompt)"
          >
            <h3>{{ example.title }}</h3>
            <p>{{ example.description }}</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Experimental project - For educational and nostalgic purposes</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      prompt: '',
      generatedCode: '',
      isGenerating: false,
      copied: false,
      examples: [
        {
          title: 'Rainbow Colors',
          description: 'Create a colorful display with cycling colors',
          prompt: 'Create a program that cycles through different background colors and displays "COMMODORE 64" in the center'
        },
        {
          title: 'Simple Animation',
          description: 'Moving text across the screen',
          prompt: 'Make a program where the text "HELLO WORLD" moves from left to right across the screen'
        },
        {
          title: 'Pattern Generator',
          description: 'Create repeating visual patterns',
          prompt: 'Generate a program that creates a checkerboard pattern using character graphics'
        },
        {
          title: 'User Input Game',
          description: 'Simple interactive program',
          prompt: 'Create a number guessing game where the computer picks a random number and the user tries to guess it'
        }
      ]
    }
  },
  methods: {
    async generateCode() {
      this.isGenerating = true
      this.generatedCode = ''
      this.copied = false
      
      try {
        // Simulate API call for now - replace with actual Anthropic API call later
        await this.simulateAPICall()
      } catch (error) {
        console.error('Error generating code:', error)
        this.generatedCode = 'Error: Failed to generate code. Please try again.'
      } finally {
        this.isGenerating = false
      }
    },
    
    async simulateAPICall() {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const userPrompt = this.prompt.toLowerCase()
      let code = ''
      
      if (userPrompt.includes('rainbow') || userPrompt.includes('color')) {
        code = `10 REM RAINBOW DISPLAY PROGRAM\n20 FOR I = 0 TO 15\n30 POKE 53280, I\n40 POKE 53281, I\n50 PRINT CHR$(147); "    RAINBOW COLORS!"\n60 FOR J = 1 TO 200: NEXT J\n70 NEXT I\n80 GOTO 20`
      } else if (userPrompt.includes('hello') || userPrompt.includes('moving')) {
        code = `10 REM MOVING TEXT DEMO\n20 PRINT CHR$(147)\n30 FOR X = 0 TO 30\n40 PRINT CHR$(19)\n50 FOR Y = 1 TO X\n60 PRINT " ";\n70 NEXT Y\n80 PRINT "HELLO WORLD"\n90 FOR T = 1 TO 100: NEXT T\n100 NEXT X\n110 GOTO 30`
      } else if (userPrompt.includes('pattern') || userPrompt.includes('checkerboard')) {
        code = `10 REM CHECKERBOARD PATTERN\n20 PRINT CHR$(147)\n30 FOR Y = 0 TO 24\n40 FOR X = 0 TO 39\n50 IF (X + Y) AND 1 THEN PRINT CHR$(160);\n60 IF NOT((X + Y) AND 1) THEN PRINT " "\n70 NEXT X\n80 PRINT\n90 NEXT Y\n100 GET A$: IF A$ = "" THEN 100\n110 RUN`
      } else if (userPrompt.includes('guess') || userPrompt.includes('game')) {
        code = `10 REM NUMBER GUESSING GAME\n20 PRINT CHR$(147)\n30 PRINT "GUESS THE NUMBER (1-100)"\n40 N = INT(RND(1) * 100) + 1\n50 T = 0\n60 INPUT "YOUR GUESS"; G\n70 T = T + 1\n80 IF G = N THEN 120\n90 IF G < N THEN PRINT "TOO LOW!"\n100 IF G > N THEN PRINT "TOO HIGH!"\n110 GOTO 60\n120 PRINT "CORRECT! YOU GOT IT IN"; T; "TRIES"\n130 PRINT "PLAY AGAIN (Y/N)?"\n140 GET A$: IF A$ = "" THEN 140\n150 IF A$ = "Y" THEN 20\n160 END`
      } else {
        code = `10 REM GENERATED C64 BASIC PROGRAM\n20 PRINT CHR$(147)\n30 PRINT "HELLO FROM CLAUDE2C64!"\n40 PRINT\n50 PRINT "THIS IS A SAMPLE PROGRAM"\n60 PRINT "GENERATED FROM YOUR PROMPT:"\n70 PRINT "\"${this.prompt}\""\n80 PRINT\n90 PRINT "PRESS ANY KEY TO CONTINUE"\n100 GET A$: IF A$ = "" THEN 100\n110 END`
      }
      
      // Convert to lowercase for emulator paste requirement
      this.generatedCode = code.toLowerCase()
    },
    
    clearAll() {
      this.prompt = ''
      this.generatedCode = ''
      this.copied = false
    },
    
    useExample(examplePrompt) {
      this.prompt = examplePrompt
    },
    
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.generatedCode)
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #40408a 0%, #6c5ce7 100%);
  padding: 20px;
  color: #a5a5ff;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 3rem;
  margin: 0;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.header p {
  font-size: 1.2rem;
  margin: 10px 0 0 0;
  color: #ddd;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.prompt-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.prompt-section h2 {
  margin-top: 0;
  color: #ffffff;
}

.prompt-input {
  width: 100%;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #a5a5ff;
  border-radius: 5px;
  color: #ffffff;
  resize: vertical;
  min-height: 100px;
}

.prompt-input::placeholder {
  color: #ccc;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.generate-btn, .clear-btn, .copy-btn {
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn {
  background: #00ff00;
  color: #000;
}

.generate-btn:hover:not(:disabled) {
  background: #00dd00;
  transform: translateY(-2px);
}

.generate-btn:disabled {
  background: #666;
  color: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: #ff6b6b;
  color: #fff;
}

.clear-btn:hover:not(:disabled) {
  background: #ff5252;
  transform: translateY(-2px);
}

.copy-btn {
  background: #4ecdc4;
  color: #000;
  margin-top: 15px;
}

.copy-btn:hover {
  background: #26d0ce;
  transform: translateY(-2px);
}

.result-section {
  background: rgba(0, 0, 0, 0.4);
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.result-section h2 {
  margin-top: 0;
  color: #ffffff;
}

.code-container {
  position: relative;
}

.loading {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 4px solid #333;
  border-top: 4px solid #00ff00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.code-output {
  background: #000;
  color: #00ff00;
  padding: 20px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  overflow-x: auto;
  white-space: pre;
  border: 2px solid #00ff00;
  text-transform: uppercase;
}

.examples-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 10px;
}

.examples-section h2 {
  margin-top: 0;
  color: #ffffff;
}

.examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.example-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.example-card:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #a5a5ff;
  transform: translateY(-2px);
}

.example-card h3 {
  margin: 0 0 10px 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.example-card p {
  margin: 0;
  color: #ddd;
  font-size: 0.9rem;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #ccc;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .examples {
    grid-template-columns: 1fr;
  }
}
</style>
