import axiosInstance from "@/shared/lib/api/config";

export type LoginValuesType = {
  username: string;
  password: string;
};

const METHOD_URL = "/api/admin/login";

export const login = async (values: LoginValuesType) => {
  try {
    const res = await axiosInstance({
      url: METHOD_URL,
      method: "POST",
      headers: {},
      data: {
        email: values.username,
        password: values.password,
      },
    })
      .then((response) => response.data)
      .catch((error) => error);
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};
