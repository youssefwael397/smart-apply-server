import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly huggingFaceApiUrl: string;
  private readonly huggingFaceApiKey: string;
  private readonly modelName = 'mistralai/Mistral-7B-Instruct-v0.1'; // Better instruction-following model

  constructor(private readonly configService: ConfigService) {
    this.huggingFaceApiKey = this.configService.get<string>(
      'HUGGINGFACE_API_KEY'
    );
    this.huggingFaceApiUrl = `https://api-inference.huggingface.co/models/${this.modelName}`;

    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.huggingFaceApiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not configured');
    }
  }

  public async suggestJobs(cvText: string): Promise<string[]> {
    console.log("🚀 ~ AiService ~ suggestJobs ~ cvText:", cvText)
    const cleanText = this.sanitizeInput(cvText);
    const prompt = this.buildPrompt(cleanText);

    try {
      const response = await this.queryHuggingFace(prompt);
      return this.parseResponse(response);
    } catch (error) {
      this.handleError(error);
      throw new Error('Failed to generate job suggestions');
    }
  }

  private sanitizeInput(text: string): string {
    console.log("🚀 ~ AiService ~ sanitizeInput ~ text:", text)
    if (typeof text !== 'string') {
      throw new BadRequestException('CV text must be a string');
    }
    return text
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .replace(/[^\w\s.,-]/g, ' ') // Remove special chars
      .substring(0, 1500); // Limit input length
  }

  private buildPrompt(cvText: string): string {
    return `
    ROLE: You are an expert career advisor specializing in tech roles.
    
    TASK: Analyze the CV below and suggest exactly 5 relevant job titles.
    
    REQUIREMENTS:
    - Return ONLY a comma-separated list of job titles
    - Do not include any other text or explanations
    - Focus on technical roles (development, engineering, design)
    - Prioritize web development roles if relevant
    
    EXAMPLE OUTPUT FORMAT:
    "Frontend Developer, Full Stack Engineer, UI Developer, JavaScript Specialist, Web Applications Engineer"
    
    CV CONTENT:
    ${cvText}
    `;
  }

  private async queryHuggingFace(prompt: string): Promise<any> {
    const response = await axios.post(
      this.huggingFaceApiUrl,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.3, // Less randomness than 0.7
          repetition_penalty: 1.5, // Avoid repetition
          top_k: 50, // Better quality suggestions
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000, // Increased timeout
      }
    );
    return response.data;
  }

  private parseResponse(response: any): string[] {
    if (!response?.[0]?.generated_text) {
      throw new Error('Invalid response format from AI service');
    }

    const rawText = response[0].generated_text;

    // First try to find a quoted list
    const quotedMatch = rawText.match(/"([^"]+)"/);
    if (quotedMatch) {
      return this.cleanJobList(quotedMatch[1]);
    }

    // Fallback to extracting the most list-like part
    const listPattern = /((?:\w+\s*,\s*){4}\w+)/;
    const listMatch = rawText.match(listPattern);

    return this.cleanJobList(listMatch ? listMatch[0] : rawText);
  }

  private cleanJobList(rawList: string): string[] {
    return rawList
      .split(',')
      .map(
        (job) =>
          job
            .trim()
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .replace(/\.$/, '') // Remove trailing period
      )
      .filter(
        (job) =>
          job.length > 0 && !job.match(/example|format|requirements|role/i) // Remove prompt fragments
      )
      .slice(0, 5);
  }

  private handleError(error: AxiosError | Error): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      this.logger.error(
        `Hugging Face API Error - Status: ${status}, Data: ${JSON.stringify(data)}`
      );

      if (status === 503) {
        throw new Error(
          'AI model is loading, please try again in 20-30 seconds'
        );
      }
    } else {
      this.logger.error(`AI Service Error: ${error.message}`);
    }
  }
}
