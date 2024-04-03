import React from "react";
import { Route } from "react-router";

export default (
  <Route>
    <Route path="/" />
    <Route path="/news" />
    <Route path="/news/:id" />
    <Route path="/news/:id/:index" />
    <Route path="/about" />
    <Route path="/photo" />
    <Route path="/photo/:id" />
    <Route path="/video" />
    <Route path="/notice" />
    <Route path="/notice/:id" />
    <Route path="*" />
    <Route path="/admin/*" />
  </Route>
);
