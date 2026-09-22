import Api from "../axios/Api";
const DEMANDEOBJET_API="demandesObjets/"

export const fetchDemandesObjetsByDonateur=async(id)=> {
return await Api.get(DEMANDEOBJET_API+'donateur/'+ id);
}
export const fetchDemandesObjetsByObjet=async(id)=> {
return await Api.get(DEMANDEOBJET_API+'objet/'+ id);
}
export const fetchDemandeObjetByAssociation=async(id)=> {
    return await Api.get(DEMANDEOBJET_API+'association/'+id);
    }
export const fetchDemandeObjetEnCoursByAssociation=async(id)=> {
    return await Api.get(DEMANDEOBJET_API+'associationEnCours/'+id);
    }
export const addDemandeObjet=async(demandeObjet)=> {
    return await Api.post(DEMANDEOBJET_API,demandeObjet);
    }
export const fetchDemandeObjetById=async(id)=> {
return await Api.get(DEMANDEOBJET_API + id);
}
export const deleteDemandeObjet=async(id) =>{
    return await Api.delete(DEMANDEOBJET_API  +'supprimer/'+ id);
    }
export const editRefusDemandeObjet=async(id) =>{
    return await Api.put(DEMANDEOBJET_API + 'refus/'+ id);
  }