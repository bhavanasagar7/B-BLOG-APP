import "./AddArticle.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWithToken } from "../../axiosWithToken"; // <-- Import your axios instance

function AddArticle() {
  let { register, handleSubmit } = useForm();
  let { currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );
  let [err, setErr] = useState("");
  let navigate = useNavigate();

  const postNewArticle = async (article) => {
    article.dateOfCreation = new Date();
    article.dateOfModification = new Date();
    article.articleId = Date.now();
    article.username = currentUser.username;
    article.comments = [];
    article.status = true;
    // Use axiosWithToken and only the endpoint path
    let res = await axiosWithToken.post('/author-api/article', article);
    console.log(res);
    if (res.data.message === 'New article created') {
      navigate(`/author-profile/articles-by-author/${currentUser.username}`);
    } else {
      setErr(res.data.message);
    }
  };

  return (
    <div className="container ">
      {/* ...existing code... */}
    </div>
  );
}
export default AddArticle;