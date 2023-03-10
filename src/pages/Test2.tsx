import { HooksCounter } from "../redux/hooks/HooksCounter";

function Test2() {
  const { count, dispatch } = HooksCounter();
  return <div>{count}</div>;
}

export default Test2;
