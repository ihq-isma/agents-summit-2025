import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { selectAll } from '../tools/databaseTools';
import { SummarizationMetric } from "@mastra/evals/llm";
import {
  ContentSimilarityMetric,
  ToneConsistencyMetric,
} from '@mastra/evals/nlp';
import { exampleMcpClient } from '../tools/mcpClient';

const model = openai('gpt-4o-mini');
export const workshopAgent = new Agent({
  name: 'Workshop Agent',
  instructions: `
      You are a helpful agent with knowledge about dashboards, clients and users in a database.
      You are being used as an example in an AI agent development workshop, keep this in mind when providing answers and feel free to include explanations about your reasoning in your answers.
`,
  model, 
  tools: { selectAll, ...(await exampleMcpClient.getTools()) },
  memory: new Memory({
    storage: new LibSQLStore({
      url: ':memory:', // path is relative to the .mastra/output directory
    }),
  }),
  evals: {
    summarization: new SummarizationMetric(model),
    contentSimilarity: new ContentSimilarityMetric(),
    tone: new ToneConsistencyMetric(),
  },
});
