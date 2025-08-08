// Serverless function (Node runtime) for generating C64 BASIC code via Anthropic API
// Non-streaming initial implementation.

const MAX_PROMPT_CHARS = 500;
const SIMPLE_MATCHES = [
  { test: /(rainbow|color)/i, code: `10 REM RAINBOW DISPLAY PROGRAM\n20 FOR I = 0 TO 15\n30 POKE 53280, I\n40 POKE 53281, I\n50 PRINT CHR$(147); "    RAINBOW COLORS!"\n60 FOR J = 1 TO 200: NEXT J\n70 NEXT I\n80 GOTO 20` },
  { test: /(hello|moving)/i, code: `10 REM MOVING TEXT DEMO\n20 PRINT CHR$(147)\n30 FOR X = 0 TO 30\n40 PRINT CHR$(19)\n50 FOR Y = 1 TO X\n60 PRINT " ";\n70 NEXT Y\n80 PRINT "HELLO WORLD"\n90 FOR T = 1 TO 100: NEXT T\n100 NEXT X\n110 GOTO 30` },
  { test: /(pattern|checkerboard)/i, code: `10 REM CHECKERBOARD PATTERN\n20 PRINT CHR$(147)\n30 FOR Y = 0 TO 24\n40 FOR X = 0 TO 39\n50 IF (X + Y) AND 1 THEN PRINT CHR$(160);\n60 IF NOT((X + Y) AND 1) THEN PRINT " "\n70 NEXT X\n80 PRINT\n90 NEXT Y\n100 GET A$: IF A$ = "" THEN 100\n110 RUN` },
  { test: /(guess|game)/i, code: `10 REM NUMBER GUESSING GAME\n20 PRINT CHR$(147)\n30 PRINT "GUESS THE NUMBER (1-100)"\n40 N = INT(RND(1) * 100) + 1\n50 T = 0\n60 INPUT "YOUR GUESS"; G\n70 T = T + 1\n80 IF G = N THEN 120\n90 IF G < N THEN PRINT "TOO LOW!"\n100 IF G > N THEN PRINT "TOO HIGH!"\n110 GOTO 60\n120 PRINT "CORRECT! YOU GOT IT IN"; T; "TRIES"\n130 PRINT "PLAY AGAIN (Y/N)?"\n140 GET A$: IF A$ = "" THEN 140\n150 IF A$ = "Y" THEN 20\n160 END` },
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const cleaned = prompt.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
    if (!cleaned) {
      return res.status(400).json({ error: 'Empty prompt' });
    }
    if (cleaned.length > MAX_PROMPT_CHARS) {
      return res.status(400).json({ error: 'Prompt too long' });
    }

    // Heuristic short-circuit
    for (const m of SIMPLE_MATCHES) {
      if (m.test.test(cleaned)) {
        return res.status(200).json({ code: m.code.toLowerCase(), cached: true });
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('Missing ANTHROPIC_API_KEY');
      return res.status(500).json({ error: 'Server not configured' });
    }

    const systemPrompt = `You are an assistant that outputs ONLY Commodore 64 BASIC code.\nConstraints:\n- Output must be valid C64 BASIC line-numbered program.\n- Use ascending line numbers, start at 10.\n- Avoid explanatory prose.\n- Keep program under ~120 lines.\n- Emphasize clarity and nostalgic style.\nUser request: ${cleaned}`;

    // Anthropic Messages API (v1/messages) example; adjust if API differs.
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          { role: 'user', content: cleaned }
        ]
      })
    });

    if (!anthropicResp.ok) {
      const text = await anthropicResp.text();
      console.error('Anthropic error', anthropicResp.status, text.slice(0, 500));
      return res.status(502).json({ error: 'Upstream generation failed' });
    }

    const data = await anthropicResp.json();
    let content = '';
    if (data && data.content && Array.isArray(data.content)) {
      content = data.content.map(p => typeof p === 'string' ? p : p.text || '').join('\n');
    } else if (data.output) {
      content = data.output;
    }

    if (!content) {
      return res.status(502).json({ error: 'No content produced' });
    }

    // Basic post-processing
    content = content.replace(/```[a-zA-Z]*\n?|```/g, '');
    // Keep only lines beginning with optional spaces + digits line number
    const lines = content.split(/\r?\n/)
      .map(l => l.replace(/\t/g, '  '))
      .filter(l => /\s*\d+\s/.test(l) || /\s*\d+$/.test(l));

    const truncated = lines.slice(0, 120); // cap lines
    let finalCode = truncated.join('\n').trim();

    if (!/^10\s/.test(finalCode)) {
      // If model didn't include numbers, prepend a basic wrapper
      finalCode = '10 REM GENERATED C64 BASIC PROGRAM\n20 ' + finalCode;
    }

    // Enforce lowercase for emulator requirement
    finalCode = finalCode.toLowerCase();

    // Size clamp
    if (finalCode.length > 15000) {
      finalCode = finalCode.slice(0, 15000);
    }

    return res.status(200).json({ code: finalCode, cached: false });
  } catch (err) {
    console.error('Handler error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
