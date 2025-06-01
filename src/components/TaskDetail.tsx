import React from 'react';
import { TaskResponse } from '@/api/taskApi';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TaskDetailProps {
  task: TaskResponse;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProgressStatus = (progress?: { processed: number; total: number }) => {
  if (!progress) return 0;
  return (progress.processed / progress.total) * 100;
};

export const TaskDetail = ({ task, onClose }: TaskDetailProps) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Task Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Task ID</h3>
            <p className="mt-1 font-mono text-sm">{task.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="mt-1 capitalize">{task.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1">
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created</h3>
            <p className="mt-1">{new Date(task.created_at).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Updated</h3>
            <p className="mt-1">{new Date(task.updated_at).toLocaleString()}</p>
          </div>
        </div>

        {task.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{task.error}</p>
          </div>
        )}

        {task.progress && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Progress</h3>
            <Progress value={getProgressStatus(task.progress)} />
            <div className="text-sm text-gray-500">
              {task.progress.processed} / {task.progress.total} items processed
            </div>
          </div>
        )}

        {task.result && task.result.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Results</h3>
            <div className="max-h-96 overflow-y-auto bg-gray-50 rounded-lg">
              <pre className="p-4 text-sm">
                {JSON.stringify(task.result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 