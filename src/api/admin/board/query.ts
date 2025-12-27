import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { BoardType, createBoard, deleteBoard, updateBoard } from "./client";

interface CreateBoardParams {
  articleInfo: Omit<ArticleInfoType, "id">;
  boardType: BoardType;
}

interface UpdateBoardParams {
  articleInfo: ArticleInfoType;
  boardType: BoardType;
}

/**
 * Internal: Factory function for creating board mutation hook
 */
const createBoardMutation = (
  queryKey: string
): (() => UseMutationResult<void, Error, CreateBoardParams, unknown>) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ articleInfo, boardType }: CreateBoardParams) =>
        createBoard(articleInfo, boardType),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };
};

/**
 * Internal: Factory function for updating board mutation hook
 */
const updateBoardMutation = (
  queryKey: string
): (() => UseMutationResult<void, Error, UpdateBoardParams, unknown>) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ articleInfo, boardType }: UpdateBoardParams) =>
        updateBoard(articleInfo, boardType),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };
};

/**
 * Internal: Factory function for deleting board mutation hook
 */
const deleteBoardMutation = (
  queryKey: string
): (() => UseMutationResult<void, Error, string, unknown>) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => deleteBoard(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };
};

// ========== News Domain ==========

/**
 * Hook for creating a new news board
 */
export const useCreateNewsBoard = createBoardMutation("news");

/**
 * Hook for updating an existing news board
 */
export const useUpdateNewsBoard = updateBoardMutation("news");

/**
 * Hook for deleting a news board
 */
export const useDeleteNewsBoard = deleteBoardMutation("news");

// ========== Training Domain ==========

/**
 * Hook for creating a new training board
 */
export const useCreateTrainingBoard = createBoardMutation("trainings");

/**
 * Hook for updating an existing training board
 */
export const useUpdateTrainingBoard = updateBoardMutation("trainings");

/**
 * Hook for deleting a training board
 */
export const useDeleteTrainingBoard = deleteBoardMutation("trainings");

// ========== Notice Domain ==========

/**
 * Hook for creating a new notice board
 */
export const useCreateNoticeBoard = createBoardMutation("notices");

/**
 * Hook for updating an existing notice board
 */
export const useUpdateNoticeBoard = updateBoardMutation("notices");

/**
 * Hook for deleting a notice board
 */
export const useDeleteNoticeBoard = deleteBoardMutation("notices");
