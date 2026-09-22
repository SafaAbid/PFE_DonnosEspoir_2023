/*import "./post.css";
import { MoreVert } from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";
//import { Users } from "../../dummyData";
import { useState } from "react";

export default function Post({ post }) {
  const [like,setLike] = useState()
  const [isLiked,setIsLiked] = useState(false)

  /*const likeHandler =()=>{
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }*/
  /*return (
    <div className="post1">
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
             // src={Users.filter((u) => u.id === post?.userId)[0].profilePicture}
             src="https://res.cloudinary.com/dmbkofiro/image/upload/v1709117251/images/ygcszdwzteepm1ht0boa.jpg"
              alt=""
            />
            <span className="postUsername">
              {//Users.filter((u) => u.id === post?.userId)[0].username
              }
              Abid Safa
            </span>
            <span className="postDate">19/07/2024</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
        
          <img className="postImg"  src="https://res.cloudinary.com/dmbkofiro/image/upload/v1709126260/images/fya3vzgvfjsegdqgdhia.jpg" />
        </div>
        <h3>FRANCE, style Louis XVI, vers 1900</h3>
        <p className="postText">
        table de salon rectangulaire en bois naturel mouluré et sculpté de frises d'entrelacs et pirouettes, reposant sur quatre pieds fuselés, cannelés et sommés d'une frise de longues feuilles, réunis par une entretoise en X.
          </p>
        <div className="postBottom">
          <div className="postBottomLeft">
            <button className="shButton" >Modifier</button>
            <button className="shButton" >Supprimer</button>
          </div>
          <div className="postBottomRight">
           <a href=""><span className="postCommentText"> liste de demandes</span></a> 
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}*/