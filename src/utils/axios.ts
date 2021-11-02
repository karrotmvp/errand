import axios, { AxiosRequestConfig } from "axios";

const fetchWrap = async ({
  method,
  url,
  params,
  body,
}: {
  method: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  params?: {};
  body?: {};
}) => {
  try {
    const config: AxiosRequestConfig = {
      baseURL: process.env.REACT_APP_ENDPOINT,
      withCredentials: true,
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const { data } =
      (method === "get" && (await axios.get(url, config))) ||
      (method === "post" && (await axios.post(url, body, config))) ||
      (method === "put" && (await axios.put(url, body, config))) ||
      (method === "delete" && (await axios.delete(url, config))) ||
      {};
    return data;
  } catch (error) {
    localStorage.removeItem("token");
    console.log(error);
    // window.location.href = "/401";
  }
};

export const GET = (url: string, params?: {}) =>
  fetchWrap({ method: "get", url, params });

export const POST = (url: string, body?: {}, params?: {}) =>
  fetchWrap({ method: "post", url, body, params });

export const PUT = (url: string, body?: {}) =>
  fetchWrap({ method: "put", url, body });

export const DELETE = (url: string) => fetchWrap({ method: "delete", url });

export const PATCH = (url: string, body?: {}) =>
  fetchWrap({ method: "patch", url, body });
