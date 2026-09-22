import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addDemandeObjet, deleteDemandeObjet, editRefusDemandeObjet, fetchDemandeObjetByAssociation, fetchDemandeObjetById, fetchDemandeObjetEnCoursByAssociation, fetchDemandesObjetsByDonateur, fetchDemandesObjetsByObjet } from '../services/demandeObjetService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export const getDemandeObjetsByAssociation = createAsyncThunk(
"demandeObjet/getDemandeObjetsByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchDemandeObjetByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getDemandeObjetsEnCoursByAssociation = createAsyncThunk(
"demandeObjet/getDemandeObjetsEnCoursByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchDemandeObjetEnCoursByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getDemandeObjetsByDonateur= createAsyncThunk(
    "demandeObjet/getDemandeObjetsByDonateur",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchDemandesObjetsByDonateur(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
}
);
export const getDemandeObjetsByObjet= createAsyncThunk(
    "demandeObjet/getDemandeObjetsByObjet",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchDemandesObjetsByObjet(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
}
);
export const createDemandeObjet= createAsyncThunk(
"demandeObjet/createDemandeObjet",
async (demandeObjet, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addDemandeObjet(demandeObjet);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findDemandeObjetByID = createAsyncThunk(
"demandeObjet/findDemandeObjetByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchDemandeObjetById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const delDemandeObjet = createAsyncThunk(
    "demandeObjet/delDemandeObjet",
    async (id,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
  const res= await deleteDemandeObjet(id);
    return res.data ;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
    export const updateRefusDemandeObjet = createAsyncThunk(
        "demandeObjet/updateRefusDemandeObjet",
        async (demandeObjet, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try{
        const res= await editRefusDemandeObjet(demandeObjet);
        return res.data
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
export const demandeObjetSlice = createSlice({
name: 'demandeObjet',
initialState:{
demandesObjets:[],
demandeObjet:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get categories
builder
.addCase(getDemandeObjetsByDonateur.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDemandeObjetsByDonateur.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.demandesObjets=action.payload;
})
.addCase(getDemandeObjetsByDonateur.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getDemandeObjetsByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDemandeObjetsByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.demandesObjets=action.payload;
    })
.addCase(getDemandeObjetsByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
.addCase(getDemandeObjetsEnCoursByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDemandeObjetsEnCoursByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.demandesObjets=action.payload;
    })
.addCase(getDemandeObjetsEnCoursByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
.addCase(getDemandeObjetsByObjet.pending, (state, action) => {
state.isLoading=true;
state.error=null;
    })
.addCase(getDemandeObjetsByObjet.fulfilled, (state, action) => {
 state.isLoading=false;
 state.error = null;
 state.demandesObjets=action.payload;
    })
.addCase(getDemandeObjetsByObjet.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
//insertion reparation
.addCase(createDemandeObjet.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createDemandeObjet.fulfilled, (state, action) => {
state.demandesObjets.push(action.payload);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: 'Votre demande a été envoyée au donateur. Veuillez patienter et vous serez informé par notification du résultat.',
    })
})
.addCase(createDemandeObjet.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Fetch donation
.addCase(findDemandeObjetByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findDemandeObjetByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.demandeObjet=action.payload;
})
.addCase(findDemandeObjetByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//refuser 
.addCase(updateRefusDemandeObjet.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;    
        })
    .addCase(updateRefusDemandeObjet.fulfilled, (state, action) => {
    state.demandesObjets = state.demandesObjets.map((item) =>
    item.id === action.payload.id ? action.payload : item);
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        MySwal.fire({
            icon: 'success',
            text: 'la demande a été refusée ',
            })
        })
    .addCase(updateRefusDemandeObjet.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
//Delete demande
.addCase(delDemandeObjet.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    })
    .addCase(delDemandeObjet.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error=null;
    state.demandesObjets=state.demandesObjets.filter((item)=> item.id!==action.payload.id)
    MySwal.fire({
        icon: 'success',
        text: 'la demande a été supprimé avec succés ',
        })
    }
    )
    .addCase(delDemandeObjet.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    })
}
}
)

export default demandeObjetSlice.reducer;