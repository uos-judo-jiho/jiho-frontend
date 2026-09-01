import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useListUsers = vi.fn();

vi.mock("@packages/api", () => ({
  v2Api: {
    get useListUsers() {
      return useListUsers;
    },
  },
}));

const { ParticipantSelect } = await import("./participant-select");

type QueryArgs = Parameters<typeof useListUsers>;

const USERS = [
  {
    id: 1,
    name: "김영민",
    generation: 34,
    major: "컴퓨터과학부",
    graduated: false,
  },
  { id: 2, name: "이지호", generation: 30, major: "행정학과", graduated: true },
];

/** orval 훅은 AxiosResponse 를 캐시하고 select 로 걸러낸다. 그 계약만 흉내 낸다. */
const mockUsers = (items: typeof USERS) => {
  useListUsers.mockImplementation(
    (
      _params: QueryArgs[0],
      options: { query?: { select?: (r: unknown) => unknown } },
    ) => ({
      data: options?.query?.select?.({
        data: { total: items.length, limit: 50, offset: 0, items },
      }),
      isFetching: false,
      isError: false,
    }),
  );
};

describe("ParticipantSelect", () => {
  beforeEach(() => {
    useListUsers.mockReset();
    mockUsers(USERS);
  });

  it("검색 결과에서 부원을 고르면 참여 인원에 이름이 추가된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ParticipantSelect value={[]} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(
      await screen.findByRole("button", { name: /34기 김영민/ }),
    );

    expect(onChange).toHaveBeenCalledWith(["김영민"]);
  });

  it("가입하지 않은 사람은 입력한 이름이 그대로 추가된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ParticipantSelect value={[]} onChange={onChange} />);

    const combobox = screen.getByRole("combobox");
    await user.type(combobox, "신입생");
    await waitFor(() =>
      expect(screen.getByText(/직접\s*추가/)).toBeInTheDocument(),
    );
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith(["신입생"]);
  });

  it("이미 추가된 부원은 다시 고를 수 없다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ParticipantSelect value={["김영민"]} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));

    expect(
      await screen.findByRole("button", { name: /34기 김영민/ }),
    ).toBeDisabled();
  });

  it("선택한 인원은 삭제 버튼으로 뺄 수 있다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ParticipantSelect value={["김영민", "이지호"]} onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "김영민 삭제" }));

    expect(onChange).toHaveBeenCalledWith(["이지호"]);
  });
});
