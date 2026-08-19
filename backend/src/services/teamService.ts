import Team from "../models/Team";
import TeamMember from "../models/TeamMember";

type TeamRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export const createTeam = async (
  name: string,
  owner: string
) => {
  const team = await Team.create({
    name,
    owner,
  });

  await TeamMember.create({
    team: team._id,
    user: owner,
    role: "owner",
  });

  return team;
};

export const getTeamsForUser = async (
  userId: string
) => {
  const memberships = await TeamMember.find({
    user: userId,
  }).populate("team");

  return memberships
    .filter((membership) => membership.team)
    .map((membership) => ({
      ...(membership.team as any).toObject(),
      role: membership.role,
    }));
};

export const getTeamById = async (
  teamId: string,
  userId: string
) => {
  const membership =
    await TeamMember.findOne({
      team: teamId,
      user: userId,
    });

  if (!membership) {
    return null;
  }

  const team = await Team.findById(teamId);

  if (!team) {
    return null;
  }

  const members = await TeamMember.find({
    team: teamId,
  }).populate(
    "user",
    "name email"
  );

  return {
    ...team.toObject(),
    role: membership.role,
    members,
  };
};

export const addTeamMember = async (
  teamId: string,
  userId: string,
  role: TeamRole
) => {
  const existingMember =
    await TeamMember.findOne({
      team: teamId,
      user: userId,
    });

  if (existingMember) {
    return null;
  }

  return TeamMember.create({
    team: teamId,
    user: userId,
    role,
  });
};

export const getTeamMember = async (
  teamId: string,
  userId: string
) => {
  return TeamMember.findOne({
    team: teamId,
    user: userId,
  });
};

export const updateMemberRole = async (
  teamId: string,
  userId: string,
  role: TeamRole
) => {
  return TeamMember.findOneAndUpdate(
    {
      team: teamId,
      user: userId,
    },
    {
      role,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const removeTeamMember = async (
  teamId: string,
  userId: string
) => {
  return TeamMember.findOneAndDelete({
    team: teamId,
    user: userId,
  });
};
