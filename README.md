# Thumbnail Generator

A Next.js application that generates YouTube thumbnails using Google's Gemini AI image generation API.

## Features

- AI-powered thumbnail generation using Gemini 3 Pro Image Preview
- Drag & drop file uploads with react-dropzone
- Multiple image inputs (Extra Images, Inspiration, Person)
- Generate 1-4 thumbnails at once
- Dark/Light theme support
- Download generated thumbnails
- Clean Midjourney-inspired UI

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: Shadcn/UI + TailwindCSS v4
- **AI**: AI SDK with Google Generative AI provider
- **Theme**: next-themes
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- Google AI API key with billing enabled (required for image generation)

### Installation

1. Clone the repository

```bash
git clone https://github.com/goddivor/thumbnail-gen.git
cd thumbnail-gen
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

**Note**: Image generation requires a paid Google AI plan. The free tier does not support image generation.

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Usage

1. Enter a prompt describing your desired thumbnail
2. (Optional) Upload reference images:
   - **Extra Images**: Additional context
   - **Inspiration**: Reference thumbnail style
   - **Person**: Person to include
3. Select the number of thumbnails to generate (1-4)
4. Click "Generate" or press Ctrl+Enter
5. Download your generated thumbnails

## API Configuration

The app uses the `gemini-3-pro-image-preview` model with the following configuration:

- Response modalities: `["TEXT", "IMAGE"]`
- Max duration: 120 seconds
- Body size limit: 10MB

## Project Structure

```
src/
├── app/
│   ├── api/generate/       # AI generation API route
│   ├── globals.css         # Dark theme styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main UI
├── components/
│   ├── theme-provider.tsx  # Theme context
│   ├── theme-toggle.tsx    # Theme switcher
│   ├── upload-zone.tsx     # File upload component
│   └── ui/                 # Shadcn components
└── lib/utils.ts
```

## License

MIT
