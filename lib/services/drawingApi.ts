import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Drawing } from "@/types";

type UpdatedDrawing = Pick<Drawing, "id"> & Partial<Omit<Drawing, "id">>;

export const drawingApi = createApi({
  reducerPath: "drawingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),

  keepUnusedDataFor: 120,
  refetchOnReconnect: true,

  tagTypes: ["Drawings"],

  endpoints: (builder) => ({
    getDrawings: builder.query<Drawing[], null>({
      query: () => "drawings",
      providesTags: ["Drawings"],
    }),
    getDrawingById: builder.query<Drawing, string>({
      query: (id) => `drawings/${id}`,
      providesTags: ["Drawings"],
    }),
    createDrawing: builder.mutation<Drawing, Drawing>({
      query: (newDrawing) => ({
        url: "drawings",
        method: "POST",
        body: newDrawing,
      }),
      invalidatesTags: ["Drawings"],
    }),
    updateDrawing: builder.mutation<Drawing, UpdatedDrawing>({
      query: (updatedDrawing) => ({
        url: "drawings",
        method: "PUT",
        body: updatedDrawing,
      }),
      invalidatesTags: ["Drawings"],
    }),
    deleteDrawing: builder.mutation<Drawing, string>({
      query: (id) => ({
        url: `drawings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Drawings"],
    }),
  }),
});

export const {
  useGetDrawingsQuery,
  useGetDrawingByIdQuery,
  useCreateDrawingMutation,
  useUpdateDrawingMutation,
  useDeleteDrawingMutation,
} = drawingApi;
