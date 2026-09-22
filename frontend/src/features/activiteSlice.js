import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addActivite, deleteActivite, editActivite, fetchActiviteByAssociation, fetchActiviteById } from '../services/activiteService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getActivitesByAssociation = createAsyncThunk(
"activite/getActivitesByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchActiviteByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const createActivite= createAsyncThunk(
"activite/createActivite",
async (activite, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addActivite(activite);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findActiviteByID = createAsyncThunk(
"activite/findActiviteByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchActiviteById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const delActivite = createAsyncThunk(
    "activite/delActivite",
    async (id,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    await deleteActivite(id);
    return id ;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
    export const updateActicite = createAsyncThunk(
        "activite/updateActicite",
        async (activite, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try{
        const res= await editActivite(activite);
        return res.data
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
export const activiteSlice = createSlice({
name: 'activite',
initialState:{
activites:[],
activite:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get activites
builder
.addCase(getActivitesByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getActivitesByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.activites=action.payload;
    })
.addCase(getActivitesByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
//insertion reparation
.addCase(createActivite.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createActivite.fulfilled, (state, action) => {
state.activites=[action.payload,...state.activites];
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: 'votre activité a été créée avec succès !',
    })
})
.addCase(createActivite.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Fetch donation
.addCase(findActiviteByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findActiviteByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.activite=action.payload;
})
.addCase(findActiviteByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//refuser 
.addCase(updateActicite.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;    
        })
    .addCase(updateActicite.fulfilled, (state, action) => {
    state.activites = state.activites.map((item) =>
    item.id === action.payload.id ? action.payload : item);
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        MySwal.fire({
            icon: 'success',
            text: 'votre activité a été modifiée avec succès !',
            })
      

        })
    .addCase(updateActicite.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
//Delete demande
.addCase(delActivite.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    })
    .addCase(delActivite.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error=null;
    state.activites=state.activites.filter((item)=> item.id!==action.payload)
    MySwal.fire({
        icon: 'success',
        text: 'votre activité a été supprimée avec succès !',
        })
    })
    .addCase(delActivite.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    })
}
}
)

export default activiteSlice.reducer;