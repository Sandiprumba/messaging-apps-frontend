import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setIsUploadingLoader } from "../../redux/reducers/misc";
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoIcon } from "@mui/icons-material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  // const selectRef =(ref) =>{ref.current.click()}
  //to make it more cleaner made it here
  //INSTEAD OF PASING LIKE THIS INSIDE THE MENUITEM
  // onClick={()=>selectRef(imageRef)}
  //PASS LIKE THIS
  const selectImage = () => imageRef.current && imageRef.current?.click();
  const selectAudio = () => audioRef.current && audioRef.current?.click();
  const selectVideo = () => videoRef.current && videoRef.current?.click();
  const selectFile = () => fileRef.current && fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setIsUploadingLoader(true));

    //get the id of sendiong data
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();
    //fetching here

    try {
      //fetching here
      //here FormData is a object build in js object used to construct key value pairs representing form fields and their values .. its is used to send data to a server using the fetch api or similar methods..when dealing with file uploads or other multipart form data requests..
      const myForm = new FormData();
      myForm.append("chatId", chatId);

      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);
      if (res.data)
        toast.success(`${key} sent successfully`, {
          id: toastId,
        });
      else toast.error(`Failed to send ${key}`, { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setIsUploadingLoader(false));
    }
  };

  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={selectImage}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input type="file" multiple accept="image/png,image/jpeg,image/gif" style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Images")} ref={imageRef} />
          </MenuItem>

          <MenuItem onClick={selectAudio}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input type="file" multiple accept="audio/mpeg,audio/wav" style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Audios")} ref={audioRef} />
          </MenuItem>

          <MenuItem onClick={selectVideo}>
            <Tooltip title="Video">
              <VideoIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input type="file" multiple accept="video/mp4, video/webm,/video/ogg" style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Videos")} ref={videoRef} />
          </MenuItem>

          <MenuItem onClick={selectFile}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input type="file" multiple accept="*" style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Files")} ref={fileRef} />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
