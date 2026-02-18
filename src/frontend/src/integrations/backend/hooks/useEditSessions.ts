import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import type { ImageEditMetadata } from '../../../backend';

export function useGetRecentEdits() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImageEditMetadata[]>({
    queryKey: ['recentEdits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentEdits();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveEditMetadata() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ imageName, editingSettings }: { imageName: string; editingSettings: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveEditMetadata(imageName, editingSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentEdits'] });
    },
  });
}
