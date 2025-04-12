/* eslint-disable react/no-unescaped-entities */
// import { NICELY_APP_URL } from "@/common/constant/domain";
import * as React from "react";

const NICELY_APP_URL = "https://nicely.vercel.app";

interface EmailTemplateProps {
  firstName: string;
}

export const GenericEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <p>Greetings {firstName},</p>
    <p>
      Don't forget to take some time to focus on yourself today! Log in to
      Nicely to keep working on your goals!
    </p>
    <p>
      Click<a href={NICELY_APP_URL}> here</a> to continue your personal growth
      journey.
    </p>
    <p
      style={{
        color: "#888",
        fontSize: "0.8em",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      If you want to turn off these reminders,{" "}
      <a href={`${NICELY_APP_URL}`}>click here to unsubscribe</a>.
      For any questions or feedback, feel free to reach out to{" "}
      <a href="mailto:tom_huang@nicely.tech">tom_hu@nicely.tech</a>
    </p>
    <p>Best,</p>
    <p>Nicely Team</p>
  </div>
);
