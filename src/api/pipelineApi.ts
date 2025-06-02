import axios from 'axios';

// Types for Pipeline API
export interface PipelineRequest {
  file: File;
  lures_per_bundle: number;
  min_usd_value: number;
  target_yen_per_lure: number;
}

export interface PipelineProgress {
  step: 'reading_file' | 'cleaning_data' | 'translation' | 'pricing' | 'bundling' | 'completed' | 'failed';
  processed?: number;
  total?: number;
}

export interface Product {
  Title: string;
  TranslatedTitle?: string;
  Price?: number;
  Currency?: string;
}

export interface Bundle {
  items: Product[];
  total_value: number;
  total_yen: number;
  yen_per_lure: number;
}

export interface PipelineResult {
  bundles: Bundle[];
  leftovers: Product[];
  translated_product_names: Product[];
}

export interface PipelineStatusResponse {
  id: string;
  type: 'pipeline';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  result?: PipelineResult;
  error?: string;
  progress?: PipelineProgress;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const startPipeline = async (request: PipelineRequest): Promise<{ task_id: string, status: "pending" }> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('lures_per_bundle', request.lures_per_bundle.toString());
  formData.append('min_usd_value', request.min_usd_value.toString());
  formData.append('target_yen_per_lure', request.target_yen_per_lure.toString());

  const response = await apiClient.post('/pipeline', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const checkPipelineStatus = async (taskId: string): Promise<PipelineStatusResponse> => {
  const response = await apiClient.get(`/tasks/${taskId}`);
  return response.data;
};

export const streamPipelineUpdates = (
  taskId: string,
  onUpdate: (data: PipelineStatusResponse) => void
) => {
  const eventSource = new EventSource(`${apiClient.defaults.baseURL}/tasks/${taskId}/stream`);
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
    if (data.status === 'completed' || data.status === 'failed') {
      eventSource.close();
    }
  };
  eventSource.onerror = () => {
    eventSource.close();
  };
  return () => eventSource.close();
}; 