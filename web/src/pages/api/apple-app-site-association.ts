import { type NextApiHandler } from "next";

const AppleAppSiteAssociationHandler: NextApiHandler = async (req, res) => {
  return res.json({
    applinks: {
      details: [
        {
          appIDs: ["TEAM_ID.APP_BUNDLE_ID"],
          components: [
            {
              "*": "*",
            },
          ],
        },
      ],
    },
  });
};

export default AppleAppSiteAssociationHandler;
