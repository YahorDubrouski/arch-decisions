import OpenAI from 'openai';
import {getOpenAIConfig} from '../../config/openai.config.js';

export function createOpenAIClient(): OpenAI {
  const {apiKey} = getOpenAIConfig();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set. Set it in backend/.env.');
  }
  return new OpenAI({apiKey});
}
