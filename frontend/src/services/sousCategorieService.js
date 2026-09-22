import Api from "../axios/Api";
const SCATEGORIE_API="sousCategories"
export const fetchSCategories=async()=> {
return await Api.get(SCATEGORIE_API);
}
export const fetchSCategorieById=async(scategorieId)=> {
return await Api.get(SCATEGORIE_API + '/' + scategorieId);
}
// afficher les objets d'une categorie.
export const fetchSCategorieByCat = async (id) => {
    return await Api.get(SCATEGORIE_API+ '/cat/' + id);
}
export const fetchSCategorieByCatAdmin = async (id) => {
    return await Api.get(SCATEGORIE_API+ '/catAdmin/' + id);
}
export const archiverSousCategorie=async(id) =>{
    return await Api.put(SCATEGORIE_API + '/archive/' +id);
    }
export const desarchiverSousCategorie=async(id) =>{
    return await Api.put(SCATEGORIE_API + '/desarchive/' +id);
    }
export const addSCategorie=async(scategorie)=> {
return await Api.post(SCATEGORIE_API,scategorie);}

export const editSCategorie=async(scategorie) =>{
return await Api.put(SCATEGORIE_API + '/' + scategorie.id, scategorie);
}
export const fetchScategorieByNom=async(nom)=> {
    return await Api.put(SCATEGORIE_API+ '/find/nomScat' , nom);
    }