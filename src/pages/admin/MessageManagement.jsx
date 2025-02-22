import { server } from "../../constants/config";
import { useFetchData } from "6pp";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Avatar, Stack, Box, Skeleton } from "@mui/material";
import Table from "../../components/shared/Table";
import { fileFormat, transformImage } from "../../lib/features";
import moment from "moment";
import RenderAttachments from "../../components/shared/RenderAttachments";
import { useErrors } from "../../hooks/hook";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachment",
    headerClassName: "table-header",
    width: 200,
    // renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} />,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box key={i}>
                <a
                  href={url}
                  download
                  target="_black"
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachments(file, url)}
                </a>
              </Box>
            );
          })
        : "No attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat-Id",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
const MessageManagement = () => {
  const { loading, data, error } = useFetchData(`${server}/api/v1/admin/messages`, "dashboard-messages");

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY,h:mm:ss a"),
        }))
      );
    }
  }, [data]);
  return <AdminLayout>{loading ? <Skeleton height={"100vh"} /> : <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200} />}</AdminLayout>;
};

export default MessageManagement;
