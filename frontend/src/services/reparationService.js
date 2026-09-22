import Api from "../axios/Api";
const REPARATION_API="reparations/"

export const fetchReparationByEntreprise=async(id)=> {
return await Api.get(REPARATION_API+'entreprise/'+id);
}
export const fetchReparationByAssociation=async(id)=> {
return await Api.get(REPARATION_API+'association/'+id);
}
export const addReparation=async(reparation)=> {
    return await Api.post(REPARATION_API,reparation);
    }
export const fetchReparationById=async(id)=> {
return await Api.get(REPARATION_API + id);
}
export const editDateRemiseReparation=async(objet) =>{
return await Api.put(REPARATION_API + '/' + objet.id, objet);
}
export const editEnCoursReparation=async(id) =>{
return await Api.put(REPARATION_API + '/enCours/' + id);
}
export const editNonValideReparation=async(id) =>{
return await Api.put(REPARATION_API + '/nonValide/' + id);
}