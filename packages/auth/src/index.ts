/**
 * NOTE: apps/admin 은 이 패키지를 쓰지 않는다. login/register 트리를
 * apps/admin/src/features/auth 로 복제해 갖고 있다 — admin 이 TanStack
 * Router 로 옮겨가면서 react-router-dom 에 묶인 이 트리를 그대로 쓸 수
 * 없게 됐기 때문이다.
 *
 * 그래서 현재 이 패키지의 소비자는 apps/shorts 하나뿐이다.
 * 여기 로그인/회원가입 화면을 고칠 때는 admin 쪽 복제본도 함께 봐야 한다.
 * shorts 도 TanStack Router 로 옮기면 복제본을 지우고 다시 합칠 것.
 */
export { LoginPage } from "./features/login";
export { Register } from "./features/register";
export { AUTH_PATHS } from "./shared/config/paths";
