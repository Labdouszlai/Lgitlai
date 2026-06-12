const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalyzeResponse {
  repo_name: string;
  tech_stack: {
    languages: Record<string, number>;
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  structure: Array<{
    name: string;
    explanation: string;
    children: string[];
  }>;
  architecture: {
    layers: Array<{ name: string; type: string }>;
    data_flow: string[];
    stack_summary: Record<string, string>;
    description: string;
  };
  code_review: Array<{
    type: string;
    severity: string;
    file: string;
    line: number;
    message: string;
  }>;
  security: Array<{
    type: string;
    severity: string;
    file: string;
    line: number;
    message: string;
    recommendation?: string;
  }>;
  documentation: {
    readme: string;
    api_documentation: string;
    developer_guide: string;
  };
  health_score: {
    overall: number;
    architecture: number;
    security: number;
    maintainability: number;
    documentation: number;
    testing: number;
    rating: string;
  };
  improvements: Array<{
    category: string;
    priority: string;
    suggestion: string;
    details: string;
  }>;
  issues: Array<{
    number: number;
    title: string;
    body: string;
    labels: string[];
  }>;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export async function analyzeRepository(repoUrl: string, beginnerMode = false): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/v1/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl, beginner_mode: beginnerMode, include_chat: true }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Analysis failed');
  }
  return res.json();
}

export async function chatWithRepository(
  repoUrl: string,
  question: string,
  beginnerMode = false,
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl, question, beginner_mode: beginnerMode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Chat failed');
  }
  return res.json();
}
