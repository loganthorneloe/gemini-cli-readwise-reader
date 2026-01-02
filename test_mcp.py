import subprocess
import json
import os
import sys

# Path to the extension
extension_path = "dist/reader.js"

if not os.path.exists(extension_path):
    print(f"Error: {extension_path} not found. Did you run 'npm run build'?")
    sys.exit(1)

# Start the MCP server process
process = subprocess.Popen(
    ["node", extension_path],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=sys.stderr,
    text=True
)

def send(msg):
    json_str = json.dumps(msg)
    process.stdin.write(json_str + "\n")
    process.stdin.flush()

def read():
    line = process.stdout.readline()
    if not line:
        return None
    return json.loads(line)

try:
    # 1. Initialize
    send({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "test-client", "version": "1.0"}
        }
    })

    init_response = read()
    if not init_response or "result" not in init_response:
        print("Initialization failed:", init_response)
        sys.exit(1)

    # 2. Notify initialized
    send({"jsonrpc": "2.0", "method": "notifications/initialized"})

    # 3. Call tool: readwise_list_documents
    send({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "readwise_list_documents",
            "arguments": {"location": "new", "page_size": 20}
        }
    })

    # Read response
    tool_response = read()
    
    if tool_response and "result" in tool_response:
        # The result content is a JSON string inside a text object
        content_block = tool_response["result"]["content"][0]
        if content_block["type"] == "text":
            documents = json.loads(content_block["text"])
            print(json.dumps(documents, indent=2))
        else:
            print(tool_response)
    else:
        print("Tool call failed:", tool_response)

finally:
    process.terminate()
