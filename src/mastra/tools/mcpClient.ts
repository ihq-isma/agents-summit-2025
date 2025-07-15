import {MCPClient} from '@mastra/mcp'

export const exampleMcpClient = new MCPClient({
  servers: {
    filesystem: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/private/tmp']
    },
  }
})
