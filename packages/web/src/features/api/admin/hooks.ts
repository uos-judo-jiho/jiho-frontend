import { useMutation } from "@tanstack/react-query";

import { login, LoginValuesType } from "./login";

export type AdminLoginFormValues = {
  email: string;
  password: string;
};

const toPayload = ({ email, password }: AdminLoginFormValues): LoginValuesType => ({
  username: email,
  password,
});

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (values: AdminLoginFormValues) => login(toPayload(values)),
  });
