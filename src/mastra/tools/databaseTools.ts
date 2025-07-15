import { createTool } from '@mastra/core/tools';
import path from 'path';
import { AsyncDatabase } from 'promised-sqlite3';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import z from 'zod';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const selectAll = createTool({
  id: 'selectAll',
  description: 'runs select queries on the sqlite3 database, returning all the results',
  inputSchema: z.object({
    query: z.string()
  }),
  outputSchema: z.any(),
  execute: async ({ context: {query}}) => {
    try {
      const db = await AsyncDatabase.open(`${__dirname}/../../database.sqlite3`, sqlite3.OPEN_READONLY)

      const result = await db.all(query)

      await db.close()

      return result
    } catch (e) {
      console.error('error', e)
      throw e
    }
  }
})
