import Api from '../axios/Api';
const USER_API="utilisateurs"
export const signup =async(user)=> {
return await Api.post(USER_API + "/register",user);
}
export const signin=async(user)=> {
return await Api.post(USER_API+"/login", user);
}
export const forgot=async(email)=> {
    return await Api.post(USER_API+"/forgot-password", {email});
    }
export const resetPass=async(id,token,motDePasse)=> {
return await Api.post(USER_API+"/reset_password/"+ id+ '/' + token,
{motDePasse});
    }
    export const editCompte= (user) => {
        return Api.put(USER_API + '/' + (user.user ? user.user.id : user.donateur? user.donateur.user.id:user.id) ,user);
    }