import { useState, useCallback } from 'react';
import { startPipeline, streamPipelineUpdates, PipelineRequest, PipelineProgress, PipelineResult, PipelineStatusResponse } from '@/api/pipelineApi';

export const usePipeline = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const start = useCallback(async (request: PipelineRequest) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgress(null);
    try {
      const { task_id } = await startPipeline(request);
      setTaskId(task_id);
      const cleanup = streamPipelineUpdates(task_id, (data: PipelineStatusResponse) => {
        setProgress(data.progress || null);
        if (data.status === 'completed') {
          setResult(data.result || null);
          setIsProcessing(false);
        } else if (data.status === 'failed') {
          setError(data.error || 'Pipeline failed');
          setIsProcessing(false);
        }
      });
      return cleanup;
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    progress,
    result,
    error,
    start,
    taskId,
  };
}; 