# img2code

Drop a screenshot, get HTML + Tailwind or React + TypeScript.

## Run
```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY (free from Google AI Studio)
npm run dev
```
Open http://localhost:3000.

## Switching provider
Set `AI_PROVIDER=gemini` (default) or `AI_PROVIDER=anthropic` in `.env.local` and restart. Run the same screenshots through both to compare output quality.

## Structure
- `app/page.tsx`: drop zone, target picker, preview and code tabs
- `app/api/generate/route.ts`: vision call (prompt + targets live here)

## Roadmap
1. Live preview for React output
2. Playwright render + diff + refine loop (the differentiator)
3. Evaluation set (20-30 screenshots) with SSIM scores
4. More targets: Vue, Svelte, Next.js, plain CSS
