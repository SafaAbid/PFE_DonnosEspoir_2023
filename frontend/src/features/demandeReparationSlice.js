import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addDemandeReparation, deleteDemandeReparation, fetchDemandeReparationAccepteesByEntreprise, fetchDemandeReparationByAssociation, fetchDemandeReparationById, fetchDemandesReparations, updateDescDemandeReparation } from '../services/demandeReparationService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { updateRep } from './donationSlice';
import { useDispatch } from 'react-redux';

const MySwal = withReactContent(Swal)
export const getDemandeReparationByAssociation = createAsyncThunk(
"demandeReparation/getDemandeReparationByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchDemandeReparationByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getDemandeReparationAccepteesByEntreprise= createAsyncThunk(
    "demandeReparation/getDemandeReparationAccepteesByEntreprise",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchDemandeReparationAccepteesByEntreprise(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
export const getDemandesReparations= createAsyncThunk(
    "demandeReparation/getDemandesReparations",
    async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchDemandesReparations();
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
}
);
export const createDemandeReparation= createAsyncThunk(
"demandeReparation/createDemandeReparation",
async (demandeReparation, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addDemandeReparation(demandeReparation);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);

export const findDemandeReparationByID = createAsyncThunk(
"demandeReparation/findDemandeReparationByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchDemandeReparationById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const delDemandeReparation = createAsyncThunk(
    "demandeReparation/delDemandeReparation",
    async (id,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
  const res= await deleteDemandeReparation(id);
    return res.data ;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
export const updateDescReparation = createAsyncThunk(
    "demandeReparation/updateDescReparation",
    async (dmd,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
  const res= await updateDescDemandeReparation(dmd);
    return res.data ;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
export const demandeReparationSlice = createSlice({
name: 'demandeReparation',
initialState:{
demandesReparations:[],
demandeReparation:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get categories
builder
.addCase(getDemandesReparations.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDemandesReparations.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.demandesReparations=action.payload;
})
.addCase(getDemandesReparations.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getDemandeReparationAccepteesByEntreprise.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDemandeReparationAccepteesByEntreprise.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.demandesReparations=action.payload;
})
.addCase(getDemandeReparationAccepteesByEntreprise.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
.addCase(getDemandeReparationByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDemandeReparationByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.demandesReparations=action.payload;
    })
.addCase(getDemandeReparationByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
//insertion reparation
.addCase(createDemandeReparation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createDemandeReparation.fulfilled, (state, action) => {
state.demandesReparations.push(action.payload);
state.isLoading=false;
state.error=null;
state.success=action.payload;
// Mettre à jour la donation dans la slice des donations
//const updatedDonation = {id:action.payload.donation.id}; 
//useDispatch(updateRep(updatedDonation));
MySwal.fire({
    icon: 'success',
    text: "Nous tenons à vous informer qu'une nouvelle demande de réparation a été créée pour cet objet.",
   // confirmButtonText: "D'accord",
    })
    // .then((result) => {
    //     if (result.isConfirmed) {
    //       window.location.reload();
    //     }
    //   });
})
.addCase(createDemandeReparation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Fetch donation
.addCase(findDemandeReparationByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findDemandeReparationByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.demandeReparation=action.payload;
})
.addCase(findDemandeReparationByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Update 
.addCase(updateDescReparation.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;
    
    })
    .addCase(updateDescReparation.fulfilled, (state, action) => {
    state.demandesReparations = state.demandesReparations.map((item) =>
    item.id === action.payload.id ? action.payload : item
    );
    state.isLoading=false;
    state.error=null;
    state.success=action.payload;
    })
    .addCase(updateDescReparation.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        state.success=null;
        })
//Delete demande
.addCase(delDemandeReparation.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    })
    .addCase(delDemandeReparation.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error=null;
    state.demandesReparations=state.demandesReparations.filter((item)=> item.id!==action.payload.id)
    MySwal.fire({
        icon: 'success',
        text: "Votre demande a été supprimée avec succès.",
        confirmButtonText: "D'accord",
        })
    })
    .addCase(delDemandeReparation.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    })
}
}
)

export default demandeReparationSlice.reducer;