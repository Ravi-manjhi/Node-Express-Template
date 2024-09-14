# Express Server in a Single File (TypeScript)

This is a simple template for creating an Express server using TypeScript in a **single file**. It includes basic configurations, a route example, and middleware setup.

## Getting Started

Follow the steps below to create and run the server.

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <project_folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Server

- **Start the server:**
   ```bash
   npm run dev
   ```

## Project Structure

The project structure is organized as follows:

```
project-root/
│
├── src/                   # Source files
│   ├── controllers/       # API route controllers
│   ├── middlewares/       # API route middlewares
│   ├── routes/            # Express routes
│   ├── app.ts             # Express application setup
│   └── server.ts          # Server entry point
│
├── lib/                   # Custom functions and modules
│
├── dist/                  # Compiled TypeScript (generated after build)
│
├── node_modules/          # Dependencies (generated after `npm install`)
│
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration file
```

### TypeScript Configuration

You'll need a `tsconfig.json` file to compile TypeScript. Here’s a minimal configuration:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Scripts in `package.json`

Include these scripts in your `package.json` for running and building the project:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev src/server.ts",
    "start": "node dist/server.js"
  }
}
```

## Customize

Feel free to customize this setup by adding more routes, connecting to databases, or using additional middleware as per your requirements.

