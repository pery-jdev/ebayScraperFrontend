import React, { useState } from 'react';
import { useTaskList, useTaskStatus } from '@/hooks/api/useTaskApi';
import { useLanguage } from './LanguageProvider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { TaskDetail } from './TaskDetail';

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

interface TaskListProps {
  isActive: boolean;
}

export const TaskList = ({ isActive }: TaskListProps) => {
  const { data: tasks, isLoading } = useTaskList(isActive);
  const { t } = useLanguage();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { data: taskDetail } = useTaskStatus(selectedTaskId || '');

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (!tasks || Object.keys(tasks).length === 0) {
    return <div>No tasks found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(tasks).map(([id, task]) => (
                <TableRow key={id}>
                  <TableCell className="font-mono text-sm">{id}</TableCell>
                  <TableCell className="capitalize">{task.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.progress && (
                      <div className="space-y-2">
                        <Progress value={getProgressStatus(task.progress)} />
                        <div className="text-xs text-gray-500">
                          {task.progress.processed} / {task.progress.total}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTaskId(id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {taskDetail && (
        <TaskDetail
          task={taskDetail}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}; 