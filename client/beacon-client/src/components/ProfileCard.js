import React from "react";
import ProfileCardHeader from "./ProfileCardHeader";
import ProfileCardBody from "./ProfileCardBody";

const ProfileCard = ({ profileInfo }) => {
  return (
    <article className="card">
      <ProfileCardHeader
        image={profileInfo.img ? `data:image/${profileInfo.img.contentType};base64,${Buffer.from(
          profileInfo.img.data.data
        ).toString("base64")}` : ""}
      />
      <ProfileCardBody
        name={profileInfo.user.name}
        bio={profileInfo.bio}
        taskCount={profileInfo.tasks.length}
        userId={profileInfo.user._id}
      />
    </article>
  );
};

export default ProfileCard;
