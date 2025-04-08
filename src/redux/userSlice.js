import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "./adminSlice";

// Async thunk for user login :
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/auth/signup", userData);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { getState }) => {
    try {
      const state = getState();
      const token = state.user.token;

      const response = await api.put(`/user/me`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("update response data :", response.data);
      return response.data;
    } catch (error) {
      console.log("user update failed ", error);
      throw error;
    }
  }
);

export const purchasePlan = createAsyncThunk(
  "member/purchasePlan",
  async (paymentInfo, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      console.log("payment info :", paymentInfo);
      const response = await api.post("/payment/purchase", paymentInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("payment response data :", response.data);

      return response.data;
    } catch (error) {
      console.log("error from purchase plan  :", error);
      return rejectWithValue(
        error.response?.data || {
          message: "An unexpected error occurred",
        }
      );
    }
  }
);

export const getMemberReaminingPaymentStatus = createAsyncThunk(
  "member/payment-status",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      const id = state.user.user._id;

      const response = await api.get(`/payment/payment-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(
        "Error fetching payment status:",
        error.response?.data || error
      );
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch payment status",
        }
      );
    }
  }
);

export const fetchUserTrainerInfo = createAsyncThunk(
  "user/TrainerInfo",
  async (_, { getState }) => {
    const state = getState();
    const id = state.user.user._id;

    const response = await api.get(`/user/trainer/${id}`);

    return response.data;
  }
);

export const fetchUserPlanInfo = createAsyncThunk(
  "user/PlanInfo",
  async (_, { getState }) => {
    const state = getState();
    const id = state.user.user._id;
    const response = await api.get(`/plan/${id}`);

    return response.data;
  }
);

export const fetchUserPaymentInfo = createAsyncThunk(
  "user/PaymentInfo",
  async (_, { getState }) => {
    const state = getState();
    const id = state.user.user._id;
    const response = await api.get(`/payment/user-payment/${id}`);

    return response.data;
  }
);

export const fetchUserTasksInfo = createAsyncThunk(
  "user/taskInfo",
  async (_, { getState }) => {
    const state = getState();
    const id = state.user.user._id;
    const response = await api.get(`/task/member/${id}`);

    return response.data;
  }
);

export const uploadUserPhoto = createAsyncThunk(
  "user/uploadAdminPhoto",
  async ({ userId, photo }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", photo);

      const response = await api.post(`/user/uploadPhoto/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.photoUrl; // Return the photo URL
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "user/getUserInfo",
  async (_, { getState }) => {
    try {
      const state = getState();
      const userId = state.user.user._id;
      const response = await api.get(`/user/userinfo/${userId}`);

      return response.data;
    } catch (error) {
      console.log("error from getuser details ", error);
    }
  }
);

export const markAttendance = createAsyncThunk(
  "user/markAttendance",
  async (date, { getState, rejectWithValue }) => {
    const state = getState(); // Get the current Redux state
    const token = state.user.token; // Retrieve token from the Redux state

    try {
      const response = await api.post(
        "/user/mark-attendance",
        { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data to be handled in the reducers
    } catch (error) {
      return rejectWithValue(error.response.data); // Reject with error response
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token")).value
      : null,
    plans: [],
    tasks: [],
    trainers: [],
    payments: [],
    paymentStatus: [],
    feedbacks: [],
    status: "idle",
    error: null,
    tempUser: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "Succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(
          "token",
          JSON.stringify({
            value: action.payload.token,
            expiry: Date.now() + 3600000,
          })
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log("update user fulfilled payload :", action.payload);
        state.status = "Succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserTrainerInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trainers = action.payload;
      })
      .addCase(fetchUserPlanInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchUserPaymentInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload;
      })
      .addCase(fetchUserTasksInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.tasks;
      })
      .addCase(purchasePlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload;
      })
      .addCase(purchasePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Contains { success: false, message: "..." }
      })
      .addCase(uploadUserPhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, photoUrl: action.payload }; // Store the photo URL in the state
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.tempUser = action.payload;
      })

      // Handle the markAttendance action states
      .addCase(markAttendance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.user = action.payload;
        // Optionally update the user data with the attendance information if needed
        alert(action.payload.message); // Show a success message from the response
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error || "Failed to mark attendance";
        alert(state.error); // Show an error message if the attendance marking failed
      })
      // .addCase(getMemberReaminingPaymentStatus.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(getMemberReaminingPaymentStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload; // Store the full payment status object
      })
      .addCase(getMemberReaminingPaymentStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch payment status";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
