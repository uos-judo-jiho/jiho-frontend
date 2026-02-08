import { useMutation } from "@tanstack/react-query";

import { login, LoginValuesType } from "./login";

export type LoginFormValues = {
  email: string;
  password: string;
};

const toPayload = ({ email, password }: LoginFormValues): LoginValuesType => ({
  username: email,
  password,
});

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (values: LoginFormValues) => login(toPayload(values)),
  });
