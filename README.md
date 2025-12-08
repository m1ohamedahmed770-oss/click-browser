# Click Browser - The AI-Powered Web Agent

A powerful, open-source web browser built on Chromium with an integrated AI agent system for automating web tasks. Click Browser combines a full-featured browser with intelligent automation capabilities, allowing you to define complex tasks in natural language and let the AI agent execute them.

## Features

### Browser Features
- **Full Chromium Integration**: Complete web browser based on Chromium engine
- **Tab Management**: Open, close, and switch between multiple tabs
- **Bookmarks System**: Save and organize your favorite websites
- **Browser Controls**: Back, forward, refresh, and URL navigation
- **Modern UI**: Clean, responsive interface with dark mode support

### AI Agent System
- **Natural Language Tasks**: Describe what you want in plain English
- **Intelligent Automation**: AI-powered agent understands and executes complex tasks
- **Web Scraping**: Extract data from websites automatically
- **Form Automation**: Fill and submit forms without manual input
- **Data Extraction**: Parse and extract structured data from web pages
- **Screenshot Analysis**: Capture and analyze page content

### Technical Features
- **Open Source**: Fully open source on GitHub
- **Self-Hosted**: Run locally or deploy to your own server
- **Privacy-First**: Your data stays with you, no cloud dependency
- **RESTful API**: tRPC-based API for programmatic access
- **Database**: MySQL/TiDB backend for task and session management
- **Authentication**: OAuth-based user authentication

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- MySQL or TiDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/click_browser.git
   cd click_browser
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   Create a `.env.local` file with your database connection and OAuth credentials:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/click_browser
   JWT_SECRET=your-secret-key
   VITE_APP_ID=your-oauth-app-id
   OAUTH_SERVER_URL=https://oauth.example.com
   ```

4. **Initialize database**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Usage

### Creating Tasks

1. Navigate to the Dashboard
2. Click "Create New Task"
3. Enter task details:
   - **Title**: A descriptive name for your task
   - **Description**: What you want the agent to do
   - **Task Type**: Choose from Web Scraping, Form Filling, Automation, or Data Extraction
4. Click "Create Task"

### Executing Tasks

1. In the Dashboard, find your task
2. Click the "Execute" button
3. The AI agent will process your request and show results

### Managing Bookmarks

1. Go to the Bookmarks page
2. Click "Add Bookmark" to save a website
3. Organize bookmarks into folders
4. Access saved bookmarks quickly from the browser

### Viewing Agent Tools

Visit the "Agent Tools" page to see all available tools the AI agent can use:
- **navigate**: Navigate to a URL
- **click**: Click on page elements
- **type**: Enter text into fields
- **screenshot**: Capture page screenshots
- **extract_text**: Extract text content
- **wait**: Wait for elements or time periods

## Architecture

### Frontend
- **React 19**: Modern UI framework
- **Tailwind CSS 4**: Utility-first styling
- **tRPC**: Type-safe API client
- **Shadcn/UI**: Beautiful component library

### Backend
- **Express 4**: Web server framework
- **tRPC 11**: Type-safe RPC framework
- **Drizzle ORM**: Database ORM
- **MySQL2**: Database driver

### Database Schema
- **users**: User accounts and authentication
- **tasks**: Task definitions and results
- **agentSessions**: Browser session tracking
- **executionHistory**: Detailed execution logs
- **bookmarks**: User bookmarks

## Development

### Project Structure
```
click_browser/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # Utilities and helpers
│   │   └── App.tsx     # Main app component
│   └── public/         # Static assets
├── server/             # Backend Express server
│   ├── routers.ts      # tRPC route definitions
│   ├── db.ts           # Database helpers
│   ├── agent.ts        # AI agent system
│   └── _core/          # Framework core
├── drizzle/            # Database schema and migrations
└── shared/             # Shared types and constants
```

### Building for Production

```bash
pnpm build
pnpm start
```

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm check
```

## API Documentation

### Task Management

#### Create Task
```typescript
POST /api/trpc/tasks.create
{
  "title": "Scrape product prices",
  "description": "Get prices from example.com",
  "taskType": "web_scrape",
  "input": {}
}
```

#### List Tasks
```typescript
GET /api/trpc/tasks.list
```

#### Execute Task
```typescript
POST /api/trpc/tasks.execute
{
  "taskId": 1,
  "description": "Scrape product prices from example.com",
  "context": {}
}
```

### Bookmarks

#### Create Bookmark
```typescript
POST /api/trpc/bookmarks.create
{
  "title": "GitHub",
  "url": "https://github.com",
  "folder": "development"
}
```

#### List Bookmarks
```typescript
GET /api/trpc/bookmarks.list
```

#### Delete Bookmark
```typescript
POST /api/trpc/bookmarks.delete
{
  "bookmarkId": 1
}
```

## Deployment

### Docker Deployment

1. Build Docker image:
   ```bash
   docker build -t click-browser .
   ```

2. Run container:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL=mysql://... \
     -e JWT_SECRET=... \
     click-browser
   ```

### Server Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Deploy to your server:
   ```bash
   scp -r dist/* user@server:/var/www/click-browser/
   ```

3. Start the application:
   ```bash
   NODE_ENV=production node dist/index.js
   ```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the API documentation

## Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Advanced scheduling for recurring tasks
- [ ] Machine learning-based task optimization
- [ ] Multi-user collaboration features
- [ ] Advanced analytics and reporting
- [ ] Custom tool creation system
- [ ] Browser extension support
- [ ] Mobile app companion

## Acknowledgments

- Built with [Chromium](https://www.chromium.org/)
- UI powered by [Shadcn/UI](https://ui.shadcn.com/)
- Type safety from [TypeScript](https://www.typescriptlang.org/)
- API framework [tRPC](https://trpc.io/)

---

**Click Browser** - Automate the web with AI
