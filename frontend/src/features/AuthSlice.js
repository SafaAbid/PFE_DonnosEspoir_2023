import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { signup, signin, editCompte } from "../services/Authservice";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const register = createAsyncThunk(
    "auth/register",
    async (user, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await signup(user);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    });
export const login = createAsyncThunk(
    "auth/login",
    async (user, thunkAPI) => {
        try {
            const res = await signin(user);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    });
export const logout = createAsyncThunk("auth/logout", () => {
    localStorage.removeItem("CC_Token");
   
});
export const updateCompte = createAsyncThunk(
    "auth/updateCompte",
    async (user, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editCompte(user);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        errorMessage: "",
        isLoggedIn: false,
        success:null,
        error:null
    },

    reducers: {
        // Reducer comes here
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.errorMessage = ""
            state.isLoggedIn = false
        }
    },
    extraReducers: (builder) => {
        //get articles
        builder
            //insertion user
            .addCase(register.pending, (state, action) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                // state.user = action.payload.user;
                state.isLoading = false;
                state.status = null;
                state.isSuccess = true;
               /*state.isLoggedIn = true;
                localStorage.setItem("CC_Token", action.payload.token);
                localStorage.setItem('refresh_token', action.payload.refreshToken);
                MySwal.fire({
                    icon: 'success',
                    text: 'Vous êtes maintenant connecté. Bienvenue sur notre site !',
                    })*/
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true
                state.status = action.payload;
                state.user = null;
                state.isLoggedIn = false;
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.isSuccess = true;
                state.user = action.payload.user;
                localStorage.setItem("CC_Token", action.payload.token);
                localStorage.setItem('refresh_token', action.payload.refreshToken);
                console.log(action.payload.user);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.errorMessage=action.payload.message
            })

            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(updateCompte.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateCompte.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.isLoading = false;
                state.error = null;
                state.success = action.payload.data;
                MySwal.fire({
                    icon: 'success',
                    text: 'Votre compte a été modifié avec succés',
                    })
            })
            .addCase(updateCompte.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
    }
}
)
export const { reset } = authSlice.actions
export default authSlice.reducer;