import React from "react";
import { Avatar, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

export default function AlbumCreateForm(props) {
  const [image, onChangeImg] = React.useState(null);
  const [imgfile, changeFile] = React.useState(null);
  const [albumData, changeData] = React.useState({
    albumPic: null,
    name: "",
  });

  const [error, setError] = React.useState(null);
  function onFormChange(e) {
    var file = e.target.files[0];
    changeFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onChangeImg(reader.result);
    };
  }

  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("albumPicFile", imgfile, imgfile.name);

    axios
      .request({
        method: "POST",
        url: "/api/albumPicUpload",
        data: fd,
      })
      .then((res) => {
        changeData({ ...albumData, albumPic: res.data.albumPicId });
      });
  }

  function onChange(e) {
    changeData({ ...albumData, [e.target.id]: e.target.value });
  }

  function createAlbum(e) {
    e.preventDefault();
    if (albumData.name === "") {
      setError("Empty Fields");
    } else if (albumData.name < 7) {
      setError("Album name should contain more than 7 characters");
    } else {
      axios
        .request({
          method: "POST",
          url: "/api/createAlbum",
          data: albumData
        })
        .then((res) => {
          if (res.data.keyValue) {
            if (res.data.keyValue.username) {
              setError("Username already exists!!!");
            }
          } else {
            props.album({
              id: res.data.id,
              album: res.data.name,
            });
            setError("Submitted");
          }
        });
    }
  }
  return (
    <div>
      {albumData.albumPic ? (
        <form className="mt-5 text-center" onSubmit={createAlbum}>
          <input
            className="bg-light rounded register-input-outline w-50 m-auto d-block"
            placeholder="Album Name"
            name="name"
            id="name"
            value={albumData.name}
            onChange={onChange}
          />
          <div className="d-flex justify-content-center mt-3 mb-3 mb-lg-4">
            {error ? <Alert severity="error">{error}</Alert> : null}
          </div>
          <button type="submit" className="btn btn-danger mt-5 mx-2">
            Create Album
          </button>
        </form>
      ) : (
        <>
          <div className="d-flex justify-content-center mb-5">
            {image !== null ? (
              <Avatar
                src={image}
                alt="user pic"
                sx={{ width: 100, height: 100 }}
              />
            ) : (
              <Avatar alt="user pic" sx={{ width: 100, height: 100 }}>
                <PersonIcon sx={{ fontSize: "50px" }} />
              </Avatar>
            )}
          </div>
          <form className="mt-5 text-center" onSubmit={onSubmit}>
            <input
              type="file"
              name="albumPicFile"
              className="bg-light rounded register-input-outline w-50 m-auto d-block"
              accept="image/png, image/jpeg"
              onChange={onFormChange}
              required
            />

            <button
              className="btn btn-danger mt-5 mx-2"
              name="submit"
              type={"submit"}
            >
              Next Step
            </button>
            <a
              className="btn btn-danger mt-5 mx-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.toChange(true);
              }}
            >
              Choose already created album
            </a>
          </form>
        </>
      )}
    </div>
  );
}
