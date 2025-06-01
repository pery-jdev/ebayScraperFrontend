import axios from 'axios';

// Common interfaces for task status
export interface TaskProgress {
  processed: number;
  total: number;
  status: 'fetching_products' | 'processing_products' | 'completed' | 'failed';
}

export interface TaskResponse {
  id: string;
  type: 'search' | 'pipeline' | 'translate' | 'bundle' | 'currency';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  result?: any[];
  error?: string;
  progress?: TaskProgress;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Check task status
export const checkTaskStatus = async (taskId: string): Promise<TaskResponse> => {
  const response = await apiClient.get(`/tasks/${taskId}`);
  return response.data;
};

// Stream task updates
export const streamTaskUpdates = (taskId: string, onUpdate: (data: TaskResponse) => void) => {
  const eventSource = new EventSource(`${apiClient.defaults.baseURL}/tasks/${taskId}/stream`);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
    
    // Close connection if task is completed or failed
    if (data.status === 'completed' || data.status === 'failed') {
      eventSource.close();
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
  };

  return () => eventSource.close(); // Return cleanup function
};

// List all tasks
export const listAllTasks = async (): Promise<Record<string, TaskResponse>> => {
  const response = await apiClient.get('/tasks');
  return response.data;
}; 