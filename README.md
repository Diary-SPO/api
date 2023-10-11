# Backend on Bun with ElysiaJS
Diary-SPO API-"proxy" on [Bun](https://bun.sh/) JS runtime + [ElysiaJS](https://elysiajs.com/) framework.

## Installation

### JS runtime
This project requires [Bun](https://bun.sh/) latest version.

Before start installing Bun, install curl and unzip. On Ubuntu/Debian run:
```bash
sudo apt install -y curl unzip
```

To install Bun on Debian/Ubuntu run:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Download
To download backend (this repository) run:
```bash
git clone https://github.com/Diary-SPO/bun-elysia/ && cd bun-elysia
```

### Dependencies
To install dependencies run:
```bash
bun i
```

## Launch
To start the basic server run:
```bash
bun .
```

To start the development server run:
```bash
bun dev
```

Open http://localhost:3003/ with your browser to see the result.