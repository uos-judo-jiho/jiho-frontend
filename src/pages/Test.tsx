import { useDispatch, useSelector } from "react-redux";
import Row from "../layouts/Row";
import { HooksCounter } from "../redux/hooks/HooksCounter";
import { decrement, increment } from "../redux/reducer/counter";
import { RootState } from "../redux/store";

function Test() {
  const { count, dispatch } = HooksCounter();

  return (
    <Row>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>

      <span>{count}</span>
    </Row>
  );
}

export default Test;
