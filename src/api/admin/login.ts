import axiosInstance from "../config";

export async function login(values: any) {
  const METHOD_URL = "api/admin/login/";

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
}
