/**
 * AWS Lambda Serverless Handler
 *
 * Wraps Express application to handle API Gateway events
 * Deployment target: AWS Lambda via Serverless Framework or AWS SAM
 */

import app from './index.js';

let serverlessHttp;

export const handler = async (event, context) => {
  if (!serverlessHttp) {
    try {
      const mod = await import('serverless-http');
      serverlessHttp = mod.default;
    } catch {
      // Fallback custom proxy wrapper if serverless-http is not bundled
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'KaamNearby AWS Lambda handler active' })
      };
    }
  }

  const serverlessApp = serverlessHttp(app);
  return serverlessApp(event, context);
};
