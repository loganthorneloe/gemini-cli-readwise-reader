# Readwise Reader MCP Server

This is a generic Model Context Protocol (MCP) server for [Readwise Reader](https://readwise.io/read).
It allows LLMs (like Gemini CLI) to list and add documents to your Reader account.

## Features

- **List Documents (Smart Search)**: Retrieve documents from your Library (Inbox, Later, Archive, Feed).
  - **Client-Side Filtering**: Filters results by title and author after fetching up to 100 recent items from the API, ensuring more relevant matches than a raw page fetch.
  - **Location Strict**: Scans are strictly scoped to the `location` you specify (e.g., searching "Inbox" will never return items from "Archive").
- **Read Full Content**: Fetch the full HTML content of any document using `readwise_get_document_details`.
- **Add Document**: Save a URL to your Reader account (Inbox or Later).

## Setup

### 1. Installation

Clone this repository and install dependencies:

```bash
npm install
npm run build
```

### 2. Configuration

You need a Readwise Access Token. Get it from [Readwise Access Token](https://readwise.io/access_token).

**Crucial:** Because this is a Gemini CLI extension, you **must** set the API key as an environment variable in your shell configuration (e.g., `.zshrc`, `.bashrc`) or in the terminal session where you run Gemini.

```bash
export READWISE_API_KEY="your_token_here"
```

## Usage

### Installing with Gemini CLI

**Local Installation:**
Navigate to the project directory and run:
```bash
gemini install extension .
```

**Remote Installation:**
Install directly from GitHub:
```bash
gemini install extension https://github.com/loganthorneloe/gemini-cli-readwise-reader
```

Ensure the `READWISE_API_KEY` is set in your environment (e.g. `.zshrc`, `.bashrc`) so the extension can access it.

### Tools

#### `readwise_list_documents`
Lists documents.
- `location`: "new" (Inbox), "later", "archive", "feed". Default is "new".
- `page_size`: Number of items to return. If filtering by title/author, the tool fetches 100 items before filtering.
- `filter_title`: Filter results by title (case-insensitive).
- `filter_author`: Filter results by author (case-insensitive).
- `filter_created_after`: ISO 8601 date string to filter newer items.

#### `readwise_add_document`
Adds a document.
- `url`: URL to save (required).
- `location`: "new" (Inbox) or "later". Default is "new".
- `tags`: Array of strings to apply as tags.

#### `readwise_get_document_details`
Get full content of a document.
- `id`: The ID of the document (from `readwise_list_documents`).
  - Returns full HTML content and metadata.