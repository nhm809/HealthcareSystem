import axiosClient from "axios"

const getInfo = async (userId) => {
     return await axiosClient.get(`/user/info/${userId}`);
}

export { getInfo };