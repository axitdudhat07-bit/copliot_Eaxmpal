# Next.js Project

A modern Next.js project with TypeScript support and best practices configured.

## Features

- ⚡ Next.js 14 with React 18
- 📘 TypeScript for type safety
- 🎨 ESLint and Prettier for code quality
- 📁 Path alias support (@/* paths)
- 🔧 API routes ready
- 🚀 Production-ready configuration

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

Build for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   └── api/
│   │       └── hello.ts
│   └── styles/
│       └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
├── .eslintrc.json
└── README.md
```

## Configuration Files

- **tsconfig.json**: TypeScript configuration with strict mode enabled
- **next.config.js**: Next.js configuration
- **.eslintrc.json**: ESLint configuration
- **.prettierrc.json**: Prettier formatting configuration
- **.gitignore**: Git ignore rules

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

MIT
