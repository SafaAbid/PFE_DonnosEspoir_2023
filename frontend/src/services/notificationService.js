import Api from "../axios/Api";
const NOTIFICATION_API="notifications/"

export const fetchNotificationByDonateur=async(id)=> {
return await Api.get(NOTIFICATION_API+'donateur/'+id);
}
export const editNotifEtat=async(id)=> {
return await Api.put(NOTIFICATION_API+id);
}
