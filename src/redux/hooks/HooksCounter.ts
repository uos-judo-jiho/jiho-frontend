import { useAppDispatch, useAppSelector } from ".";
import { RootState } from "../store/index";

export function HooksCounter() {
  const count = useAppSelector((state: RootState) => state.counter.value);
  const dispatch = useAppDispatch();

  return {
    count,
    dispatch,
  };
}
