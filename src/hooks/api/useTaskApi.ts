import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { checkTaskStatus, listAllTasks, streamTaskUpdates, TaskResponse } from '@/api/taskApi';

// Query key factory
const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
};

// Hook for listing all tasks
export const useTaskList = (enabled = false) => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: listAllTasks,
    refetchInterval: enabled ? 5000 : false, // Only refetch if enabled
    enabled, // Only fetch when enabled
  });
};

// Hook for individual task status
export const useTaskStatus = (taskId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => checkTaskStatus(taskId),
    refetchInterval: (data) => {
      // Only refetch if task is not completed or failed
      return data?.data?.status === 'completed' || data?.data?.status === 'failed' ? false : 5000;
    },
  });

  // Set up SSE for real-time updates
  useEffect(() => {
    if (!taskId) return;

    const cleanup = streamTaskUpdates(taskId, (data) => {
      queryClient.setQueryData(taskKeys.detail(taskId), data);
    });

    return cleanup;
  }, [taskId, queryClient]);

  return query;
}; 