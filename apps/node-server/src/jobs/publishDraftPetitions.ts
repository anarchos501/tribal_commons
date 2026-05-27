import cron from "node-cron";
import { publishExpiredDraftPetitionsData } from "../domains/petitions/petitionService";

export const startDraftPetitionPublisher = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await publishExpiredDraftPetitionsData();
    } catch (error) {
      console.error(
        "Unable to publish expired draft petitions",
        error
      );
    }
  });
};
