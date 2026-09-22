import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addCategorie, archiveCategorie, desarchiveCategorie, editCategorie, fetchCategorieById, fetchCategorieByNom, fetchCategories, fetchCategoriesAdmin } from '../services/categorieService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export const getCategories = createAsyncThunk(
"scategorie/getCategories",
async (_, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchCategories();
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getCategoriesAdmin = createAsyncThunk(
"scategorie/getCategoriesAdmin",
async (_, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchCategoriesAdmin();
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);

export const createCategorie = createAsyncThunk(
"scategorie/createCategorie",
async (categorie, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addCategorie(categorie);
return res.data
}
catch (error) {
return rejectWithValue(error.message);

}
}
);
export const archiverCategorie = createAsyncThunk(
    "categorie/archiverCategorie",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res= await archiveCategorie(id);
    return res.data
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
);
export const desarchiverCategorie = createAsyncThunk(
    "categorie/desarchiverCategorie",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res= await desarchiveCategorie(id);
    return res.data
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
);

export const updateCategorie = createAsyncThunk(
"scategorie/updateCategorie",
async (categorie, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await editCategorie(categorie);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findCategorieByID = createAsyncThunk(
"scategorie/findCategorieByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchCategorieById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const findCategorieByNom = createAsyncThunk(
"scategorie/findCategorieByNom",
async (nom,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchCategorieByNom(nom);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});

export const categorieSlice = createSlice({
name: 'categorie',
initialState:{
categories:[],
categorie:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get categories
builder
.addCase(getCategories.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getCategories.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.categories=action.payload;
})
.addCase(getCategories.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getCategoriesAdmin.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getCategoriesAdmin.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.categories=action.payload;
})
.addCase(getCategoriesAdmin.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
//insertion scategorie
.addCase(createCategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createCategorie.fulfilled, (state, action) => {
state.categories.push(action.payload);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: 'la catégorie a été créée avec succès !',
    })
})
.addCase(createCategorie.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Modification categorie
.addCase(updateCategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;

})
.addCase(updateCategorie.fulfilled, (state, action) => {
state.categories = state.categories.map((item) =>
item.id === action.payload.id ? action.payload : item
);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: 'la catégorie a été modifiée avec succès !',
    })
})
.addCase(updateCategorie.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    state.success=null;
    })
//archiver
.addCase(archiverCategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;    
    })
.addCase(archiverCategorie.fulfilled, (state, action) => {
state.categories = state.categories.map((item) =>
item.id === action.payload.id ? action.payload : item);
    state.isLoading=false;
    state.error=null;
    state.success=action.payload;
    MySwal.fire({
        icon: 'success',
        text: 'la catégorie a été désactivée avec succès !',
        })
       // window.location.reload()
    })
.addCase(archiverCategorie.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        state.success=null;
        })
//desarchiver
.addCase(desarchiverCategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;    
    })
.addCase(desarchiverCategorie.fulfilled, (state, action) => {
state.categories = state.categories.map((item) =>
item.id === action.payload.id ? action.payload : item);
    state.isLoading=false;
    state.error=null;
    state.success=action.payload;
    MySwal.fire({
        icon: 'success',
        text: 'la catégorie a été activée avec succès !',
        })
       // window.location.reload()
    })
.addCase(desarchiverCategorie.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        state.success=null;
        })
//Fectch categorie
.addCase(findCategorieByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(
    findCategorieByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.categorie=action.payload;
})
.addCase(findCategorieByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
.addCase(findCategorieByNom.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findCategorieByNom.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.categorie=action.payload;
})
.addCase(findCategorieByNom.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
}
}
)

export default categorieSlice.reducer;