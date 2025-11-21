# Deploying to Vercel

Quick steps to deploy this project to Vercel and keep your API key secret.

1. Create a Vercel account and install the Vercel CLI (optional):
   - https://vercel.com/docs

2. Add the `GEMINI_API_KEY` as a Vercel Environment Variable (Project Settings > Environment Variables)
   - Key: `GEMINI_API_KEY`
   - Value: your API key from Google Cloud

3. Deploy
   - Option A (recommended): Connect your Git repository to Vercel and deploy from the Git provider.
   - Option B (CLI): from project root run `vercel` and follow prompts.

Notes
 - The serverless function is `api/report.js`. The frontend calls `/api/report` (no API key in client).
 - Do NOT commit your API key to the repository. Use the Vercel project env vars or secret store.
