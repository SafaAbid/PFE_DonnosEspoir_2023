import "./sidebar.css";


export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
        <li className="sidebarListItem">
        <i class="fa-solid fa-right-to-bracket"  style={{marginRight:'10px',fontSize:'25px'}}></i>
            <span className="sidebarListItemText" style={{fontSize:'18px'}}>Accueil</span>
           
          </li>
          <li className="sidebarListItem">
          <i class="fa-solid fa-hand"  style={{marginRight:'10px',fontSize:'20px'}}> </i>
            <span className="sidebarListItemText" style={{fontSize:'18px'}}>Liste de demandes</span>
           
          </li>
          <li className="sidebarListItem">
          <i  style={{marginRight:'10px',fontSize:'20px'}} className="fa-solid fa-calendar-days"></i>
            <span className="sidebarListItemText" style={{fontSize:'18px'}}>Liste de rendez-vous</span>
          </li>
          <li className="sidebarListItem">
          <i class="fa-solid fa-handshake-angle"  style={{marginRight:'10px',fontSize:'20px'}}></i>
            <span className="sidebarListItemText" style={{fontSize:'18px'}}>Liste des associations</span>
          </li>
          <li className="sidebarListItem">
          <i class="fa-solid fa-lock"  style={{marginRight:'10px',fontSize:'20px'}}></i>
            <span className="sidebarListItemText" style={{fontSize:'18px'}}>Liste des associations bloquées</span>
          </li>
          
        </ul>
       
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {/*Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))*/}
        </ul>
      </div>
    </div>
  );
}