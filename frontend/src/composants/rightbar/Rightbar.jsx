import "./rightbar.css";
//import { Users } from "../../dummyData";
//import Online from "../online/Online";

export default function Rightbar({ profile }) {
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {/*Users.map((u) => (
            <Online key={u.id} user={u} />
          ))*/}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">informations:</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Ville:</span>
            <span className="rightbarInfoValue">Sfax</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">pays:</span>
            <span className="rightbarInfoValue">Tunisie</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">télephones:</span>
            <span className="rightbarInfoValue">55555555</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">email:</span>
            <span className="rightbarInfoValue">ss@gmail.com</span>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <ProfileRightbar /> 
      
      </div>
    </div>
  );
}