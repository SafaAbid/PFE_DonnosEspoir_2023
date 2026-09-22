import Api from "../axios/Api";
const ACTIVITE_API="activites/"

export const fetchActiviteByAssociation=async(id)=> {
    return await Api.get(ACTIVITE_API+'association/'+id);
    }
export const addActivite=async(activite)=> {
    return await Api.post(ACTIVITE_API,activite);
    }
export const fetchActiviteById=async(id)=> {
return await Api.get(ACTIVITE_API + id);
}
export const deleteActivite=async(id) =>{
    return await Api.delete(ACTIVITE_API  + id);
    }
export const editActivite=async(activite) =>{
    return await Api.put(ACTIVITE_API +'modification/'+ activite.id, activite);
  }