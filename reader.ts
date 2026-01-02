import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';

const API_KEY = process.env.READWISE_API_KEY;
if (!API_KEY) {
  console.error("Error: READWISE_API_KEY environment variable is required.");
  process.exit(1);
}

const API_BASE_URL = 'https://readwise.io/api/v3';
const headers = {
  'Authorization': `Token ${API_KEY}`,
  'Content-Type': 'application/json',
};

interface ReadwiseDocument {
  id: string;
  title: string;
  author: string;
  url: string;
  created_at: string;
  summary?: string;
  [key: string]: unknown;
}

interface ReadwiseListResponse {
  results: ReadwiseDocument[];
  [key: string]: unknown;
}

const server = new McpServer({
  name: 'readwise-reader',
  version: '1.0.0',
});

server.tool(
  'readwise_list_documents',
  {
    location: z.enum(['new', 'later', 'archive', 'feed']).default('new').describe('Location to search: new (inbox), later, archive, feed'),
    page_size: z.number().optional().describe('Number of items to return. If omitted, returns all matches.'),
    filter_title: z.string().optional().describe('Filter by title (case-insensitive)'),
    filter_author: z.string().optional().describe('Filter by author (case-insensitive)'),
    filter_created_after: z.string().optional().describe('ISO 8601 date string to filter newer items'),
  },
  async ({ location, page_size, filter_title, filter_author, filter_created_after }) => {
    try {
        const params: Record<string, unknown> = {
            location,
            page_size: (filter_title || filter_author) ? 100 : page_size, // Fetch more if filtering
        };
        if (filter_created_after) params.saved_after = filter_created_after;

        const response = await axios.get<ReadwiseListResponse>(`${API_BASE_URL}/list/`, { headers, params });
        let results = response.data.results || [];

        // Client-side filtering
        if (filter_title) {
            results = results.filter((doc) => doc.title && doc.title.toLowerCase().includes(filter_title.toLowerCase()));
        }
        if (filter_author) {
            results = results.filter((doc) => doc.author && doc.author.toLowerCase().includes(filter_author.toLowerCase()));
        }

        const formatted = results.slice(0, page_size).map((doc) => ({
            id: doc.id,
            title: doc.title,
            author: doc.author,
            url: doc.url,
            created_at: doc.created_at,
            summary: doc.summary,
        }));

        return {
            content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }]
        };
    } catch (error: any) {
        return {
            content: [{ type: 'text', text: `Error listing documents: ${error.message}` }],
            isError: true,
        };
    }
  }
);

server.tool(
    'readwise_add_document',
    {
        url: z.string().describe('URL to save'),
        location: z.enum(['new', 'later']).default('new').describe('Target location'),
        tags: z.array(z.string()).optional().describe('Tags to apply')
    },
    async ({ url, location, tags }) => {
        try {
            await axios.post(`${API_BASE_URL}/save/`, { url, location, tags }, { headers });
            return {
                content: [{ type: 'text', text: `Successfully saved ${url} to ${location}` }]
            };
        } catch (error: any) {
            return {
                content: [{ type: 'text', text: `Error adding document: ${error.message}` }],
                isError: true,
            };
        }
    }
);

server.tool(
    'readwise_get_document_details',
    {
        id: z.string().describe('Document ID'),
    },
    async ({ id }) => {
        try {
            const response = await axios.get<ReadwiseListResponse>(`${API_BASE_URL}/list/`, { 
                headers, 
                params: { id, withHtmlContent: 'true' } 
            });
            const doc = response.data.results?.[0];
            
            if (!doc) {
                return {
                    content: [{ type: 'text', text: 'Document not found' }],
                    isError: true,
                };
            }
            return {
                content: [{ type: 'text', text: JSON.stringify(doc, null, 2) }]
            };
        } catch (error: any) {
            return {
                content: [{ type: 'text', text: `Error getting details: ${error.message}` }],
                isError: true,
            };
        }
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);