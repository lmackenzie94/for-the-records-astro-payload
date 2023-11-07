# TO-DO:

1. Sort out TypeScript / Prettier errors
2. Add pagination to records and artists pages
3. Add Prettier pre-commit hook
4. Add ES/TS Lint?
5. Add tests
6. Remove "genre" field from "Records" collection API response (old field)
7. Get auth working
8. Add "tracklist" + "about this track" functionality (+ "Favourite" functionality?)
9. Need unique slugs in case records/artists happen to have same name
10. Setup tailwind config properly (add all colors, font, etc.)
11. Add data and src/media back to .gitignore files
12. Show thumbnail image in CMS List view for Records and Artists
13. make imageURL field required if no custom image is set, and vice versa (Records and Artists)
14. mobile styling
15. try container queries for Record and Artist components
16. Fix color preview if custom record image is used
17. Limit homepage to 8 records (random?)
18. add clear visual indication in CMS list view of which records/artists were created by the user vs other users
19. make this a PWA (with offline support)
20. remove // @ts-nocheck where used
21. Resize / compress uploaded images
    - https://unpic.pics/
22. clean up node modules / package.json; remove unused packages
23. build a custom CMS view for Records and Artists (similar to how they're displayed on the front end)
24. Commit buddy.yml file
25. Images uploaded via production CMS won't show up locally (and vice versa) - what to do about this? 🤔
26. Somehow allow Lexical editor to use Record/Artist theme colours
27. "Content" live preview only works if the field has existing content
28. Get drafts and versions working
29. Seems like lexical editor "Content" field has an empty <p> tag as the default value ... ??
30. Set up Payload blocks - make them work with Lexical
31. Don't rebuild CMS on push if only front-end files have changed
32. How to export/import data from CMS?
33. BUG: json error in console on Production (related to Content / LivePreview) - causes own/want filters not to work if you go to a record page then back to the Records page

# LOOK INTO:

1. Payload "Local API"
2. Possible to seed DB with initial test/dev data? (https://github.com/payloadcms/public-demo/blob/master/src/cron/reset.ts)
3. Cloudinary plugin
4. why are so many images being created during build?
5. "Too Many Requests" error

# Deploy Process Notes

- had to geneate new SSH keys within the droplet with `sudo ssh-keygen`
- copied the new public key to Github
- manually cloned the repo to the droplet with `git clone`
- install node on the droplet with `sudo apt update` && `sudo apt install nodejs`
- install npm on the droplet with `sudo apt install npm`
- install yarn on the droplet with `sudo npm install -g yarn`

curl "https://api.discogs.com/database/search?q=Nirvana&type=artist&token=lvSqsEIAVQNHGbsYiVRDSUwSZHidyBUKGTFdZKYb"
