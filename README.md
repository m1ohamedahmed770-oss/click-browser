# Click Browser - The Agent Browser 🖱️

A sophisticated AI-powered browser agent that operates in a secure sandbox environment. Click Browser allows you to delegate web browsing tasks to an intelligent agent while maintaining complete data privacy and security.

## Features ✨

### 🎨 Modern Design
- **Glassmorphism UI**: Beautiful frosted glass effect with modern aesthetics
- **Neon Color Palette**: Vibrant neon purple, blue, and white colors
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Cursor Logo**: Custom animated cursor icon with neon glow effects

### 🤖 Agent Capabilities
- **Task Submission**: Give the agent natural language tasks to perform
- **Safe Execution**: All operations run in an isolated sandbox environment
- **Task History**: Track all submitted tasks and their results
- **Real-time Status**: Monitor agent status and task progress

### 🔒 Security Features
- **Data Protection**: Blocks access to sensitive personal information
- **No Financial Access**: Prevents access to credit cards, banking information, and payment systems
- **Account Protection**: Cannot access user accounts or authentication credentials
- **Sandbox Isolation**: All operations are isolated and cannot affect the host system
- **Input Validation**: Comprehensive security checks on all tasks

## Technology Stack 🛠️

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express.js + tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **Testing**: Vitest
- **Styling**: Glassmorphism + Neon effects

## Security Restrictions 🛡️

The agent **cannot** access or perform:
- ❌ Credit card or payment information
- ❌ Banking or financial accounts
- ❌ Personal identification numbers (SSN, passport, etc.)
- ❌ Passwords or authentication tokens
- ❌ Cryptocurrency wallets or private keys
- ❌ Medical or health records
- ❌ File system operations

The agent **can** safely perform:
- ✅ Navigate websites
- ✅ Search for information
- ✅ Read public content
- ✅ Click elements and interact with pages
- ✅ Fill non-sensitive forms
- ✅ Take screenshots
- ✅ Extract and analyze text

## Getting Started 🚀

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL/TiDB database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/m1ohamedahmed770-oss/click-browser.git
cd click-browser
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env` file with the following variables:
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=your_oauth_url
```

4. **Run database migrations**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure 📁

```
click-browser/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── routers/           # tRPC route definitions
│   ├── agent.ts           # Agent security system
│   ├── db.ts              # Database queries
│   └── routers.ts         # Main router
├── drizzle/               # Database schema and migrations
└── shared/                # Shared types and constants
```

## Key Components 🧩

### AgentInterface Component
Main UI component that provides:
- Task input field
- Task history with tabs (Recent/Completed)
- Agent status dashboard
- Security information display
- Language selector

### useAgent Hook
Custom React hook for agent interactions:
- `submitTask()`: Submit a new task
- `checkTaskStatus()`: Check task status
- `refreshHistory()`: Refresh task history
- Access to agent status and security info

### Agent Security System
Comprehensive security layer that:
- Validates tasks against blocked patterns
- Sanitizes sensitive data
- Enforces browser restrictions
- Logs security events
- Creates execution contexts

## Testing 🧪

Run all tests:
```bash
pnpm test
```

Run specific test file:
```bash
pnpm test server/agent.test.ts
```

The project includes 20+ security tests covering:
- Task validation
- Data sanitization
- Restricted patterns
- Browser restrictions
- Execution contexts

## API Documentation 📚

### tRPC Procedures

#### `agent.submitTask`
Submit a new task to the agent.
```typescript
const result = await trpc.agent.submitTask.mutate({
  task: "Search for weather information"
});
```

#### `agent.getTaskStatus`
Get the status of a specific task.
```typescript
const status = await trpc.agent.getTaskStatus.query({
  taskId: "task-123"
});
```

#### `agent.getTaskHistory`
Get user's task history.
```typescript
const history = await trpc.agent.getTaskHistory.query({
  limit: 20,
  offset: 0
});
```

#### `agent.getAgentStatus`
Get current agent status.
```typescript
const status = await trpc.agent.getAgentStatus.query();
```

## Security Considerations 🔐

1. **Sandbox Environment**: All agent operations run in an isolated sandbox
2. **Input Validation**: All tasks are validated against security patterns
3. **Data Sanitization**: Sensitive data is automatically redacted
4. **Access Control**: User-specific task isolation
5. **Audit Logging**: All security events are logged

## Development Guidelines 💻

### Adding New Features
1. Update schema in `drizzle/schema.ts`
2. Run `pnpm db:push` to migrate
3. Add database helpers in `server/db.ts`
4. Create tRPC procedures in `server/routers/`
5. Build UI components in `client/src/components/`
6. Write tests in `server/*.test.ts`

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write tests for new features
- Use Tailwind CSS for styling
- Maintain component documentation

## Performance Optimization ⚡

- Lazy loading of components
- Optimized database queries
- Efficient state management with React Query
- CSS-in-JS with Tailwind
- Minified production builds

## Browser Support 🌐

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For support, issues, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review security guidelines

## Roadmap 🗺️

- [ ] Multi-language support (Arabic, English)
- [ ] Advanced task scheduling
- [ ] Browser automation recording
- [ ] Custom security policies
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Task templates library
- [ ] Webhook integrations

## Acknowledgments 🙏

Built with modern web technologies and security best practices. Special thanks to the open-source community for the amazing libraries and tools used in this project.

---

**Click Browser** - Making web automation safe, secure, and intelligent. 🚀
