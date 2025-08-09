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
          placeholder="Describe the program you want (e.g., a rainbow effect with moving text)"
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
        <div class="code-container c64-screen">
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
      copied: false
    }
  },
  methods: {
    async generateCode() {
      this.isGenerating = true
      this.generatedCode = ''
      this.copied = false
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: this.prompt })
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Request failed')
        }
        const data = await res.json()
        this.generatedCode = data.code || ''
      } catch (error) {
        console.error('Error generating code:', error)
        this.generatedCode = 'error: failed to generate code. please try again.'
      } finally {
        this.isGenerating = false
      }
    },
    
    clearAll() {
      this.prompt = ''
      this.generatedCode = ''
      this.copied = false
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.generatedCode)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2000)
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
  background: transparent;
  padding: 30px 0;
  border-radius: 0;
  margin-bottom: 30px;
}

.result-section h2 {
  margin-top: 0;
  color: #ffffff;
}

.code-container { position: relative; }

/* Commodore 64 style screen wrapper */
.c64-screen {
  /* classic C64-ish palette */
  --c64-border: #6c5eb5;   /* border light blue/purple */
  --c64-bg: #3b31a2;       /* screen dark blue */
  --c64-text: #a8a8ff;     /* light blue text */

  border: 18px solid var(--c64-border);
  background: var(--c64-bg);
  padding: 18px;
  border-radius: 2px;
  box-shadow: inset 0 0 0 4px var(--c64-bg), 0 6px 20px rgba(0,0,0,0.25);
}

.loading { text-align: center; padding: 40px; color: var(--c64-text); }

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 4px solid rgba(255,255,255,0.15);
  border-top: 4px solid var(--c64-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.code-output {
  background: transparent; /* inherits from c64-screen */
  color: var(--c64-text);
  padding: 8px 4px;
  border-radius: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.35;
  overflow-x: auto;
  white-space: pre;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer { text-align: center; margin-top: 40px; color: #ccc; font-size: 0.9rem; }

@media (max-width: 768px) {
  .header h1 { font-size: 2rem; }
  .button-group { flex-direction: column; }
}
</style>
