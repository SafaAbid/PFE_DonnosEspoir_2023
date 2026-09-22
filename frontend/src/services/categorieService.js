import Api from "../axios/Api";
const CATEGORIE_API="categories"

export const fetchCategories=async()=> {
return await Api.get(CATEGORIE_API);
}
export const fetchCategoriesAdmin=async()=> {
return await Api.get(CATEGORIE_API+'/admin');
}
export const fetchCategorieById=async(id)=> {
return await Api.get(CATEGORIE_API + '/' + id);
}
export const fetchCategorieByNom=async(nom)=> {
return await Api.put(CATEGORIE_API + '/nomCat' , nom);
}
export const archiveCategorie=async(id) =>{
    return await Api.put(CATEGORIE_API + '/archive/' + id);
    }
export const desarchiveCategorie=async(id) =>{
    return await Api.put(CATEGORIE_API + '/desarchive/' + id);
    }
export const addCategorie=async(categorie)=> {
return await Api.post(CATEGORIE_API,categorie);
}
export const editCategorie=async(categorie) =>{
return await Api.put(CATEGORIE_API + '/' + categorie.id, categorie);
}