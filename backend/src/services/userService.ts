import User from "../models/User";

export const searchUsers = async (
  search: string
) => {
  const users = await User.find({
    $or: [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  })
    .select("_id name email")
    .limit(10);

  return users;
};