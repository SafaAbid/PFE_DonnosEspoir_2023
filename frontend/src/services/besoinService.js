import Api from "../axios/Api";
const BESOIN_API="besoins/";
export const fetchBesoinsByAssociation=async(id)=> {
    return await Api.get(BESOIN_API+'association/'+id);
    }
export const addBesoin=async(besoin)=> {
    return await Api.post(BESOIN_API,besoin);
    }
export const fetchBesoinById=async(id)=> {
return await Api.get(BESOIN_API + id);
}
export const deleteBesoin=async(id) =>{
    return await Api.delete(BESOIN_API  + id);
    }
export const editBesoin=async(besoin) =>{
    return await Api.put(BESOIN_API + besoin.id, besoin);
  }
export const fetchBesoinByCat=async(besoin) =>{
    return await Api.put(BESOIN_API +'besoin/Cat/', besoin);
  }