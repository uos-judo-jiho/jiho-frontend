import { LoginValuesType, login as loginApi } from "@/features/api/admin/login";
import { Cookies } from "react-cookie";
import { create } from "zustand";

type SessionType = { isLogin: boolean };

const defaultSessionAtom: SessionType = { isLogin: false };

type SessionStore = {
  session: SessionType;
  setSession: (session: SessionType) => void;
};

const useSessionStore = create<SessionStore>((set) => ({
  session: defaultSessionAtom,
  setSession: (session) => set({ session }),
}));

const useSession = () => {
  const { session: storedSession, setSession } = useSessionStore();
  const cookies = new Cookies();

  const login = async (values: LoginValuesType) => {
    const res = await loginApi(values);

    if (!res || res?.message) {
      alert("로그인에 실패하였습니다.");
    } else {
      const resSession: SessionType = { isLogin: true };
      setSession({ isLogin: true });
      sessionStorage.setItem("session", JSON.stringify(resSession));
    }
  };

  const session: SessionType =
    storedSession.isLogin && cookies.get("JSESSIONID")
      ? storedSession
      : JSON.parse(
          sessionStorage.getItem("session") ??
            JSON.stringify(defaultSessionAtom),
        );

  return { login, session };
};

export default useSession;
