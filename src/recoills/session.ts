import { atom, useRecoilState } from "recoil";
import { LoginValuesType, login as loginApi } from "../api/admin/login";

type SessionType = { isLogin: boolean };

const defaultSessionAtom: SessionType = { isLogin: false };

const sessionAtom = atom<SessionType>({
  key: "sessionAtomKey",
  default: defaultSessionAtom,
});

const useSession = () => {
  const [_session, _setSession] = useRecoilState(sessionAtom);

  const login = async (values: LoginValuesType) => {
    const res = await loginApi(values);

    if (!res || res?.message) {
      alert("로그인에 실패하였습니다.");
    } else {
      const resSession: SessionType = { isLogin: true };
      _setSession({ isLogin: true });
      sessionStorage.setItem("session", JSON.stringify(resSession));
    }
  };

  const session: SessionType = _session.isLogin
    ? _session
    : JSON.parse(
        sessionStorage.getItem("session") ?? JSON.stringify(defaultSessionAtom)
      );

  return { login, session };
};

export default useSession;
