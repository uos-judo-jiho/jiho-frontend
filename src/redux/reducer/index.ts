import counter from "./counter";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  counter,
});
