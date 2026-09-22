import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { editNotifEtat, fetchNotificationByDonateur } from '../services/notificationService';

export const getNotificationByDonateur = createAsyncThunk(
    "notification/getNotificationByDonateur",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchNotificationByDonateur(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
    export const updateEtatNotif = createAsyncThunk(
        "benevole/updateEtatNotif",
        async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try{
        const res= await editNotifEtat(id);
        return res.data
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
    export const notificationSlice = createSlice({
        name: 'notification',
        initialState:{
        notifications:[],
        notification:{},
        isLoading: false,
        success:null,
        error:null,
        },
        extraReducers: (builder) => {
        builder
        .addCase(getNotificationByDonateur.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        })
        .addCase(getNotificationByDonateur.fulfilled, (state, action) => {
        state.isLoading=false;
        state.error = null;
        state.notifications=action.payload;
        })
        .addCase(getNotificationByDonateur.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        console.log("impossible de se connecter au serveur")
        })
        .addCase(updateEtatNotif.pending, (state, action) => {
            state.isLoading=true;
            state.error=null;
            state.success=null;    
                })
            .addCase(updateEtatNotif.fulfilled, (state, action) => {
            state.notifications = state.notifications.map((item) =>
            item.id === action.payload.id ? action.payload : item);
                state.isLoading=false;
                state.error=null;
                state.success=action.payload;
                })
            .addCase(updateEtatNotif.rejected, (state, action) => {
                    state.isLoading=false;
                    state.error=action.payload;
                    state.success=null;
                    })
    }}
)
export default notificationSlice.reducer;