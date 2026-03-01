// TODO: 리펙토링 필요

import FormContainer from "@/components/admin/form/FormContainer";
import {
  NewArticleButton,
  FormContainer as SectionContainer,
  StyledInput,
} from "@/components/admin/form/StyledComponent/FormContainer";
import SubmitModal from "@/components/common/Modals/AlertModals/SubmitModal";
import Row from "@/components/layouts/Row";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v2Admin, v2Api } from "@packages/api";
import { v2ApiModel } from "@packages/api/model";
import { useQueryClient } from "@tanstack/react-query";
import {
  useEffect,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const emptyForm = {
  title: "",
  gold: 0,
  silver: 0,
  bronze: 0,
  menGroup: 0,
  womenGroup: 0,
  group: 0,
};

type AwardFormState = typeof emptyForm;

type AwardItem = v2ApiModel.GetApiV2Awards200AwardsItem;

type SortableRowProps = {
  id: number;
  children: ReactNode;
  handle: ReactNode;
};

const SortableRow = ({ id, children, handle }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {children}
      <td className="px-3 py-3 text-center">
        <button
          ref={setActivatorNodeRef}
          className="text-slate-600 hover:text-slate-900"
          {...attributes}
          {...listeners}
          type="button"
          aria-label="순서 변경"
        >
          {handle}
        </button>
      </td>
    </tr>
  );
};

export const Awards = () => {
  const queryClient = useQueryClient();
  const [createValues, setCreateValues] = useState<AwardFormState>(emptyForm);
  const [editValues, setEditValues] = useState<AwardFormState>(emptyForm);
  const [editingAwardId, setEditingAwardId] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [orderedAwards, setOrderedAwards] = useState<AwardItem[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const {
    data: awards = [],
    isLoading,
    refetch,
  } = v2Api.useGetApiV2Awards({
    query: {
      select: (response) => response.data.awards ?? [],
    },
  });

  const invalidateAwards = () => {
    queryClient.invalidateQueries({
      queryKey: v2Api.getGetApiV2AwardsQueryKey(),
    });
  };

  const createAwardMutation = v2Admin.usePostApiV2AdminAwards({
    mutation: {
      onSuccess: invalidateAwards,
    },
    axios: {
      withCredentials: true,
    },
  });

  const updateAwardMutation = v2Admin.usePutApiV2AdminAwardsAwardId({
    mutation: {
      onSuccess: invalidateAwards,
    },
    axios: {
      withCredentials: true,
    },
  });

  const deleteAwardMutation = v2Admin.useDeleteApiV2AdminAwardsAwardId({
    mutation: {
      onSuccess: invalidateAwards,
    },
    axios: {
      withCredentials: true,
    },
  });

  const handleNumberChange = (
    setter: Dispatch<SetStateAction<AwardFormState>>,
    key: keyof AwardFormState,
    value: string,
  ) => {
    setter((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleTextChange = (
    setter: Dispatch<SetStateAction<AwardFormState>>,
    value: string,
  ) => {
    setter((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleCreate = async () => {
    try {
      await createAwardMutation.mutateAsync({ data: createValues });
      setCreateValues(emptyForm);
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      alert("수상이력 등록에 실패했습니다.");
    }
  };

  const startEdit = (award: AwardItem) => {
    setEditingAwardId(award.id);
    setEditValues({
      title: award.title,
      gold: award.gold,
      silver: award.silver,
      bronze: award.bronze,
      menGroup: award.menGroup,
      womenGroup: award.womenGroup,
      group: award.group,
    });
  };

  const cancelEdit = () => {
    setEditingAwardId(null);
    setEditValues(emptyForm);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedAwards((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);

      if (oldIndex < 0 || newIndex < 0) {
        return prev;
      }

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleUpdate = async () => {
    if (editingAwardId === null) return;

    try {
      await updateAwardMutation.mutateAsync({
        awardId: editingAwardId,
        data: editValues,
      });
      setIsUpdateOpen(false);
      cancelEdit();
    } catch (error) {
      console.error(error);
      alert("수상이력 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (pendingDeleteId === null) return;

    try {
      await deleteAwardMutation.mutateAsync({ awardId: pendingDeleteId });
      setPendingDeleteId(null);
    } catch (error) {
      console.error(error);
      alert("수상이력 삭제에 실패했습니다.");
    }
  };

  const openDeleteModal = (awardId: number) => {
    setPendingDeleteId(awardId);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!isReorderMode) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousOverflowX = document.body.style.overflowX;
    const previousOverflowY = document.body.style.overflowY;
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowX = previousOverflowX;
      document.body.style.overflowY = previousOverflowY;
    };
  }, [isReorderMode]);

  const displayAwards = isReorderMode ? orderedAwards : awards;

  return (
    <FormContainer title="수상이력 관리">
      <div className="space-y-6">
        <Row justifyContent="space-between" style={{ marginBottom: "4px" }}>
          <div className="text-sm text-slate-500">
            수상 기록을 최신 상태로 유지하세요.
          </div>
          <Row gap={10} justifyContent="end" className="w-auto">
            {!isReorderMode && (
              <>
                <NewArticleButton
                  className="rounded-full px-5 shadow-sm"
                  onClick={() => {
                    setCreateValues(emptyForm);
                    setIsCreateOpen(!isCreateOpen);
                  }}
                >
                  {isCreateOpen ? "취소" : "신규 등록"}
                </NewArticleButton>
                <NewArticleButton
                  className="rounded-full px-5 shadow-sm"
                  onClick={() => {
                    setCreateValues(emptyForm);
                    setIsCreateOpen(false);
                    cancelEdit();
                    setIsUpdateOpen(false);
                    setIsDeleteOpen(false);
                    setPendingDeleteId(null);
                    setOrderedAwards(awards);
                    setIsReorderMode(true);
                  }}
                >
                  순서 변경
                </NewArticleButton>
                <NewArticleButton
                  className="rounded-full px-5 shadow-sm"
                  onClick={() => refetch()}
                >
                  새로고침
                </NewArticleButton>
              </>
            )}
            {isReorderMode && (
              <NewArticleButton
                className="rounded-full px-5 shadow-sm"
                onClick={() => setIsReorderMode(false)}
              >
                완료
              </NewArticleButton>
            )}
          </Row>
        </Row>

        <SectionContainer className="bg-white p-6 mb-0 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                수상이력 목록
              </div>
              <div className="text-sm text-slate-500">
                {awards.length}건의 수상이력이 있습니다.
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="py-6 text-slate-500">로딩중...</div>
          ) : (
            <div
              className={`mt-4 rounded-xl border border-slate-200 ${
                isReorderMode
                  ? "overflow-x-hidden overflow-y-hidden"
                  : "overflow-x-auto overflow-y-auto"
              }`}
              style={isReorderMode ? { maxHeight: 480 } : {}}
            >
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">순번</th>
                    <th className="px-4 py-3 text-left font-semibold">제목</th>
                    <th className="px-3 py-3 font-semibold">금</th>
                    <th className="px-3 py-3 font-semibold">은</th>
                    <th className="px-3 py-3 font-semibold">동</th>
                    <th className="px-3 py-3 font-semibold">남단체</th>
                    <th className="px-3 py-3 font-semibold">여단체</th>
                    <th className="px-3 py-3 font-semibold">단체</th>
                    <th className="px-3 py-3 font-semibold text-center">
                      {isReorderMode ? "순서" : "작업"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isCreateOpen && !isReorderMode && (
                    <tr className="bg-blue-50/40">
                      <td className="px-4 py-3 text-left text-slate-500">
                        신규
                      </td>
                      <td className="px-4 py-3 text-left text-slate-900">
                        <StyledInput
                          type="text"
                          value={createValues.title}
                          className="h-9 rounded-md px-3 border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleTextChange(
                              setCreateValues,
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StyledInput
                          type="number"
                          min={0}
                          value={createValues.gold}
                          className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleNumberChange(
                              setCreateValues,
                              "gold",
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StyledInput
                          type="number"
                          min={0}
                          value={createValues.silver}
                          className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleNumberChange(
                              setCreateValues,
                              "silver",
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StyledInput
                          type="number"
                          min={0}
                          value={createValues.bronze}
                          className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleNumberChange(
                              setCreateValues,
                              "bronze",
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StyledInput
                          type="number"
                          min={0}
                          value={createValues.menGroup}
                          className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleNumberChange(
                              setCreateValues,
                              "menGroup",
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StyledInput
                          type="number"
                          min={0}
                          value={createValues.womenGroup}
                          className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleNumberChange(
                              setCreateValues,
                              "womenGroup",
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StyledInput
                          type="number"
                          min={0}
                          value={createValues.group}
                          className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                          onChange={(event) =>
                            handleNumberChange(
                              setCreateValues,
                              "group",
                              event.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        <Row gap={10} justifyContent="center">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleCreate()}
                          >
                            등록
                          </button>
                          <button
                            className="text-slate-500 hover:underline"
                            onClick={() => setIsCreateOpen(false)}
                          >
                            취소
                          </button>
                        </Row>
                      </td>
                    </tr>
                  )}
                  {displayAwards.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-slate-500"
                        colSpan={9}
                      >
                        등록된 수상이력이 없습니다.
                      </td>
                    </tr>
                  ) : isReorderMode ? (
                    <DndContext
                      sensors={sensors}
                      modifiers={[
                        restrictToVerticalAxis,
                        restrictToParentElement,
                      ]}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={displayAwards.map((award) => award.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {displayAwards.map((award, index) => (
                          <SortableRow
                            key={award.id}
                            id={award.id}
                            handle={<span className="cursor-grab">::</span>}
                          >
                            <td className="px-4 py-3 text-left text-slate-500">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-left text-slate-900">
                              {award.title}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {award.gold}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {award.silver}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {award.bronze}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {award.menGroup}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {award.womenGroup}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {award.group}
                            </td>
                          </SortableRow>
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    displayAwards.map((award, index) => {
                      const isEditing =
                        !isReorderMode && editingAwardId === award.id;

                      return (
                        <tr
                          key={award.id}
                          className={
                            isEditing
                              ? "bg-slate-50"
                              : "hover:bg-slate-50 transition-colors"
                          }
                        >
                          <td className="px-4 py-3 text-left text-slate-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-slate-900">
                            {isEditing ? (
                              <StyledInput
                                type="text"
                                value={editValues.title}
                                className="h-9 rounded-md px-3 border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleTextChange(
                                    setEditValues,
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.title
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <StyledInput
                                type="number"
                                min={0}
                                value={editValues.gold}
                                className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleNumberChange(
                                    setEditValues,
                                    "gold",
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.gold
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <StyledInput
                                type="number"
                                min={0}
                                value={editValues.silver}
                                className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleNumberChange(
                                    setEditValues,
                                    "silver",
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.silver
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <StyledInput
                                type="number"
                                min={0}
                                value={editValues.bronze}
                                className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleNumberChange(
                                    setEditValues,
                                    "bronze",
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.bronze
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <StyledInput
                                type="number"
                                min={0}
                                value={editValues.menGroup}
                                className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleNumberChange(
                                    setEditValues,
                                    "menGroup",
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.menGroup
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <StyledInput
                                type="number"
                                min={0}
                                value={editValues.womenGroup}
                                className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleNumberChange(
                                    setEditValues,
                                    "womenGroup",
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.womenGroup
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <StyledInput
                                type="number"
                                min={0}
                                value={editValues.group}
                                className="h-9 w-16 rounded-md px-2 text-center border border-slate-300 focus:border-slate-400"
                                onChange={(event) =>
                                  handleNumberChange(
                                    setEditValues,
                                    "group",
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              award.group
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Row gap={10} justifyContent="center">
                              {isEditing ? (
                                <>
                                  <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => setIsUpdateOpen(true)}
                                  >
                                    저장
                                  </button>
                                  <button
                                    className="text-slate-500 hover:underline"
                                    onClick={cancelEdit}
                                  >
                                    취소
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => startEdit(award)}
                                  >
                                    수정
                                  </button>
                                  <button
                                    className="text-rose-500 hover:underline"
                                    onClick={() => openDeleteModal(award.id)}
                                  >
                                    삭제
                                  </button>
                                </>
                              )}
                            </Row>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionContainer>
      </div>

      <SubmitModal
        confirmText="수정"
        cancelText="취소"
        description="수상이력을 수정할까요?"
        open={isUpdateOpen}
        setOpen={setIsUpdateOpen}
        onSubmit={handleUpdate}
      />
      <SubmitModal
        confirmText="삭제"
        cancelText="취소"
        description="수상이력을 삭제할까요?"
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        onSubmit={handleDelete}
      />
    </FormContainer>
  );
};
