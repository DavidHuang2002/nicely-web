/* eslint-disable react/no-unescaped-entities */
// import { NICELY_APP_URL } from "@/common/constant/domain";
import * as React from "react";

const NICELY_APP_URL = "https://nicely.vercel.app";

interface EmailTemplateProps {
  firstName: string;
}

export const JournalReminderTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ firstName }) => (
  <div>
    <p>Greetings {firstName},</p>
    <p>
      Don't forget to take some time to focus on yourself today! It can be as
      simple as taking a minute to just jot down how you're feeling. Or you can
      take a few minutes to write a longer entry. It's up to you!
    </p>
    <p>
      Click<a href={NICELY_APP_URL}> here</a> to journal your thoughts and
      feelings.
    </p>
    <p
      style={{
        color: "#888",
        fontSize: "0.8em",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      If you want to turn off these reminders, you can do so in your profile
      page. For any questions or feedback, feel free to reach out to{" "}
      <a href="mailto:davidhuang@nicely.tech">davidhuang@nicely.tech</a>
    </p>
    <p>Best,</p>
    <p>Nicely Team</p>
  </div>
);
