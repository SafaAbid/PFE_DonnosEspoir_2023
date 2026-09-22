import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addReparation, editDateRemiseReparation, editEnCoursReparation, editNonValideReparation, fetchReparationByAssociation, fetchReparationByEntreprise, fetchReparationById } from '../services/reparationService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export const getReparationsByEntreprise = createAsyncThunk(
"reparation/getReparationsByEntreprise",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchReparationByEntreprise(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getReparationByAssociation = createAsyncThunk(
"reparation/getReparationByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchReparationByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const createReparation = createAsyncThunk(
"reparation/createReparation",
async (reparation, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addReparation(reparation);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const updateDateRemiseReparation = createAsyncThunk(
"reparation/updateDateRemiseReparation",
async (objet, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await editDateRemiseReparation(objet);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const updateEnCoursReparation = createAsyncThunk(
"reparation/updateEnCoursReparation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await editEnCoursReparation(id);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const updateNonValideReparation = createAsyncThunk(
"reparation/updateNonValideReparation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await editNonValideReparation(id);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findReparationByID = createAsyncThunk(
"reparation/findReparationByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchReparationById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});

export const reparationSlice = createSlice({
name: 'reparation',
initialState:{
reparations:[],
reparation:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get categories
builder
.addCase(getReparationsByEntreprise.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getReparationsByEntreprise.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.reparations=action.payload;
})
.addCase(getReparationsByEntreprise.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getReparationByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getReparationByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.reparations=action.payload;
})
.addCase(getReparationByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
//insertion reparation
.addCase(createReparation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createReparation.fulfilled, (state, action) => {
state.reparations.push(action.payload);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    title: 'une nouvelle réparation a été ajouté avec succés',
    })
})
.addCase(createReparation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Modification categorie
.addCase(updateDateRemiseReparation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;

})
.addCase(updateDateRemiseReparation.fulfilled, (state, action) => {
state.reparations = state.reparations.map((item) =>
item.id === action.payload.id ? action.payload : item
);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: "Le rendez-vous de restitution de l'objet a été enregistré avec succès",
    })
})
.addCase(updateDateRemiseReparation.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    state.success=null;
    })
.addCase(updateEnCoursReparation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;

})
.addCase(updateEnCoursReparation.fulfilled, (state, action) => {
state.reparations = state.reparations.map((item) =>
item.id === action.payload.id ? action.payload : item
);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    title: 'Le rendez-vous a été modifié avec succès ',
    })
})
.addCase(updateEnCoursReparation.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    state.success=null;
    })
.addCase(updateNonValideReparation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;

})
.addCase(updateNonValideReparation.fulfilled, (state, action) => {
state.reparations = state.reparations.map((item) =>
item.id === action.payload.id ? action.payload : item
);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    title: 'Le rendez-vous a été marqué non réalisé avec succès ',
    })
})
.addCase(updateNonValideReparation.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    state.success=null;
    })

//Fectch reparation
.addCase(findReparationByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findReparationByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.reparation=action.payload;
})
.addCase(findReparationByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
}
}
)

export default reparationSlice.reducer;