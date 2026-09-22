import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { affecterBenevoleRendezVous, editNonRealiseRendezVous, editRealiseRendezVous, editRendezVous, fetchRendezVousByAssociation, fetchRendezVousByBenevole, fetchRendezVousByDonateur, fetchRendezVousByEntreprise, fetchRendezVousById, fetchRendezVousReparationsByAssociation, fetchRendezVousReparationsByEntreprise, modifierBenevoleRendezVous } from '../services/rendezVousService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getRendezVousByAssociation = createAsyncThunk(
"scategorie/getRendezVousByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchRendezVousByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getRendezVousByDonateur = createAsyncThunk(
    "scategorie/getRendezVousByDonateur",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchRendezVousByDonateur(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
    export const getRendezVousByEntreprise = createAsyncThunk(
        "rendezVous/getRendezVousByEntreprise",
        async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
        const res = await fetchRendezVousByEntreprise(id);
        return res.data;
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
        export const getRendezVousReparationsByEntreprise = createAsyncThunk(
            "rendezVous/getRendezVousReparationsByEntreprise",
            async (id, thunkAPI) => {
            const { rejectWithValue } = thunkAPI;
            try {
            const res = await fetchRendezVousReparationsByEntreprise(id);
            return res.data;
            }
            catch (error) {
            return rejectWithValue(error.message);
            }
            }
            );
        export const getRendezVousReparationsByAssociation= createAsyncThunk(
            "rendezVous/getRendezVousReparationsByAssociation",
            async (id, thunkAPI) => {
            const { rejectWithValue } = thunkAPI;
            try {
            const res = await fetchRendezVousReparationsByAssociation(id);
            return res.data;
            }
            catch (error) {
            return rejectWithValue(error.message);
            }
            }
            );
 export const getRendezVousByBenevole= createAsyncThunk(
"rendezVous/getRendezVousByBenevole",
 async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
 try {
 const res = await fetchRendezVousByBenevole(id);
  return res.data;
            }
catch (error) {
 return rejectWithValue(error.message);
         }
            }
            );
 export const affecterUnBenevoleRendezVous = createAsyncThunk(
                "rendezVous/affecterBenevoleRendezVous",
                async (objet, thunkAPI) => {
                const { rejectWithValue } = thunkAPI;
                try{
                const res= await affecterBenevoleRendezVous(objet);
                return res.data
                }
                catch (error) {
                return rejectWithValue(error.message);
                }
                }
                );
 export const updateBenevoleRendezVous = createAsyncThunk(
                "rendezVous/updateBenevoleRendezVous",
                async (objet, thunkAPI) => {
                const { rejectWithValue } = thunkAPI;
                try{
                const res= await modifierBenevoleRendezVous(objet);
                return res.data
                }
                catch (error) {
                return rejectWithValue(error.message);
                }
                }
                );
export const updateRendezVous = createAsyncThunk(
"rendezVous/updateRendezVous",
async (rendez, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await editRendezVous(rendez);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const updateRealise= createAsyncThunk(
    "rendezVous/updateRealise",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res= await editRealiseRendezVous(id);
    return res.data
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
    export const updateNonRealise= createAsyncThunk(
        "rendezVous/updateNonRealise",
        async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try{
        const res= await editNonRealiseRendezVous(id);
        return res.data
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
export const findRendezVousByID = createAsyncThunk(
"scategorie/findRendezVousByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchRendezVousById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});

export const rendezVousSlice = createSlice({
name: 'rendezVous',
initialState:{
desRendezVous:[],
rendezVous:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get categories
builder
.addCase(getRendezVousByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getRendezVousByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.desRendezVous=action.payload;
})
.addCase(getRendezVousByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getRendezVousByDonateur.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    })
    .addCase(getRendezVousByDonateur.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error = null;
    state.desRendezVous=action.payload;
    })
    .addCase(getRendezVousByDonateur.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    console.log("impossible de se connecter au serveur")
    })
    .addCase(getRendezVousByEntreprise.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        })
        .addCase(getRendezVousByEntreprise.fulfilled, (state, action) => {
        state.isLoading=false;
        state.error = null;
        state.desRendezVous=action.payload;
        })
        .addCase(getRendezVousByEntreprise.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        console.log("impossible de se connecter au serveur")
        })
        .addCase(getRendezVousReparationsByEntreprise.pending, (state, action) => {
            state.isLoading=true;
            state.error=null;
            })
            .addCase(getRendezVousReparationsByEntreprise.fulfilled, (state, action) => {
            state.isLoading=false;
            state.error = null;
            state.desRendezVous=action.payload;
            })
            .addCase(getRendezVousReparationsByEntreprise.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            console.log("impossible de se connecter au serveur")
            })
        .addCase(getRendezVousReparationsByAssociation.pending, (state, action) => {
            state.isLoading=true;
            state.error=null;
            })
            .addCase(getRendezVousReparationsByAssociation.fulfilled, (state, action) => {
            state.isLoading=false;
            state.error = null;
            state.desRendezVous=action.payload;
            })
            .addCase(getRendezVousReparationsByAssociation.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            console.log("impossible de se connecter au serveur")
            })
        .addCase(getRendezVousByBenevole.pending, (state, action) => {
            state.isLoading=true;
            state.error=null;
            })
            .addCase(getRendezVousByBenevole.fulfilled, (state, action) => {
            state.isLoading=false;
            state.error = null;
            state.desRendezVous=action.payload;
            })
            .addCase(getRendezVousByBenevole.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            console.log("impossible de se connecter au serveur")
            })

//Modification 
.addCase(updateRendezVous.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;

})
.addCase(updateRendezVous.fulfilled, (state, action) => {
state.desRendezVous = state.desRendezVous.map((item) =>
item.id === action.payload.id ? action.payload : item
);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: "le rendez-vous a été modifié avec succès",
    })
//window.location.reload();
})
.addCase(updateRendezVous.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    state.success=null;
    })
    .addCase(updateRealise.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        state.success=null;
        
        })
        .addCase(updateRealise.fulfilled, (state, action) => {
        state.desRendezVous = state.desRendezVous.map((item) =>
        item.id === action.payload.id ? action.payload : item
        );
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        // MySwal.fire({
        //     icon: 'success',
        //     text: 'Le rendez-vous a été correctement enregistré comme réalisé',
        //     })
        //window.location.reload()
        })
        .addCase(updateRealise.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
    .addCase(updateNonRealise.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        state.success=null;
        })
        .addCase(updateNonRealise.fulfilled, (state, action) => {
        state.desRendezVous = state.desRendezVous.map((item) =>
        item.id === action.payload.id ? action.payload : item
        );
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        MySwal.fire({
            icon: 'success',
            text: 'Le rendez-vous a été correctement enregistré comme non réalisé',
            })
        })
        .addCase(updateNonRealise.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
    .addCase(updateBenevoleRendezVous.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        state.success=null;
        
        })
        .addCase(updateBenevoleRendezVous.fulfilled, (state, action) => {
        state.desRendezVous = state.desRendezVous.map((item) =>
        item.id === action.payload.id ? action.payload : item
        );
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        })
        .addCase(updateBenevoleRendezVous.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
    .addCase(affecterUnBenevoleRendezVous.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        state.success=null;
        
        })
        .addCase(affecterUnBenevoleRendezVous.fulfilled, (state, action) => {
        state.desRendezVous = state.desRendezVous.map((item) =>
        item.id === action.payload.id ? action.payload : item
        );
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        })
        .addCase(affecterUnBenevoleRendezVous.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })

//Fectch categorie
.addCase(findRendezVousByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(
    findRendezVousByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.rendezVous=action.payload;
})
.addCase(findRendezVousByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
}
}
)

export default rendezVousSlice.reducer;