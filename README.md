# Readwise Reader MCP Server

This is a generic Model Context Protocol (MCP) server for [Readwise Reader](https://readwise.io/read).
It allows LLMs (like Gemini CLI) to list and add documents to your Reader account.

## Features

- **List Documents (Smart Search)**: Retrieve documents from your Library (Inbox, Later, Archive, Feed).
  - **Deep Scanning**: If you provide a filter (e.g., "title contains Rust"), the tool will scan your *entire* history in that location until it finds the requested number of matches. It does not stop at the first page.
  - **Location Strict**: Scans are strictly scoped to the `location` you specify (e.g., searching "Inbox" will never return items from "Archive").
  - **Token Efficient**: Filters by title, author, and date are applied *before* returning data to the LLM.
- **Read Full Content**: Fetch the full HTML content of any document using `readwise_get_document_details`.
- **Add Document**: Save a URL to your Reader account (Inbox or Later). Adding to Feed is restricted.

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

### Running with Gemini CLI (or other MCP clients)

To use this with Gemini CLI, you can configure it as an extension tool.

**Command:**
```bash
node /path/to/gemini-cli-readwise-reader/dist/index.js
```

Ensure the `READWISE_API_KEY` is set in the environment where you run the client.

### Tools

#### `readwise_list_documents`
Lists documents.
- `location`: "inbox" (or "new"), "later", "archive", "feed". 
  - **Note**: If specified, the search is strictly limited to this location.
- `page_size`: Number of matching items to return. 
  - **Warning**: If omitted, it will fetch **ALL** matching documents from the API. It is recommended to set a limit (e.g., 20).
- `filter_title`: Filter results by title (case-insensitive).
- `filter_author`: Filter results by author (case-insensitive).
- `filter_published_after` / `filter_published_before`: ISO 8601 date string.
- `filter_created_after` / `filter_created_before`: ISO 8601 date string.
- `updatedAfter`: ISO 8601 date string.

#### `readwise_add_document`
Adds a document.
- `url`: URL to save (required).
- `location`: "inbox" (default), "later".
- `tags`: Array of strings.
- `title`: Override title.
- `author`: Override author.
- `summary`: Override summary.
- `published_date`: ISO 8601 date string.
- `image_url`: Cover image URL.
- `html`: HTML content (if not providing a URL to scrape).
- `should_clean_html`: Boolean to clean the provided HTML.
- `saved_using`: Identifier for the saving client.

#### `readwise_get_document_details`
Get full content of a document.
- `id`: The ID of the document (from `readwise_list_documents`).
  - Returns full HTML content and metadata.
