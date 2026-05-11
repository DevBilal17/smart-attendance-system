import { configureStore } from "@reduxjs/toolkit";
import { classAPI } from "./services/classAPI";
import { teacherAPI } from "./services/teacherAPI";
import { subjectAPI } from "./services/subjectAPI";
import { studentAPI } from "./services/studentAPI";
import { authAPI } from "./services/authAPI";
import { timetableAPI } from "./services/timetableAPI";
import {attendanceAPI} from "./services/attendanceAPI";
import {dashboardAPI} from "./services/dashboardAPI";
import {reportsAPI} from "./services/reportsAPI";
import authReducer from "./slices/authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [classAPI.reducerPath]: classAPI.reducer,
    [teacherAPI.reducerPath]: teacherAPI.reducer,
    [subjectAPI.reducerPath]: subjectAPI.reducer,
    [studentAPI.reducerPath]: studentAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [attendanceAPI.reducerPath]: attendanceAPI.reducer,
    [reportsAPI.reducerPath]: reportsAPI.reducer,
    [timetableAPI.reducerPath]: timetableAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(classAPI.middleware, teacherAPI.middleware, subjectAPI.middleware, studentAPI.middleware, authAPI.middleware, attendanceAPI.middleware, reportsAPI.middleware, timetableAPI.middleware, dashboardAPI.middleware),
});