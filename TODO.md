# TO-DO:

1. Sort out TypeScript / Prettier errors
2. Add pagination to records and artists pages
3. Add Prettier pre-commit hook
4. Add ES/TS Lint?
5. Add tests
6. Remove "genre" field from "Records" collection API response (o)
7. Get auth working
8. Add "tracklist" + "about this track" functionality (+ "Favourite" functionality?)
9. Need unique slugs in case records/artists happen to have same name
10. Setup tailwind config properly (add all colors, font, etc.)
11. Add data and src/media back to .gitignore files
12. Show thumbnail image in CMS List view for Records and Artists
13. make imageURL field required if no custom image is set, and vice versa (Records and Artists)
14. write "fetchArtistName" function in RecordImages.tsx properly (i.e don't hardcode localhost)
15. mobile styling
16. try container queries for Record and Artist components

# LOOK INTO:

1. had to `yarn install` locally to stop errors (... or maybe just had to restart VSCode?)
2. why do I have to use `sudo` before `yarn` commands?
   1. also have to delete `"credsStore": "desktop"` from ~/.docker/config.json
3. Payload "Local API"
4. Possible to seed DB with initial test/dev data?
5. Cloudinary plugin
6. why are so many images being created during build?

# Deploy Process Notes

- had to geneate new SSH keys within the droplet with `sudo ssh-keygen`
- copied the new public key to Github
- manually cloned the repo to the droplet with `git clone`
- install node on the droplet with `sudo apt update` && `sudo apt install nodejs`
- install npm on the droplet with `sudo apt install npm`
- install yarn on the droplet with `sudo npm install -g yarn`

curl "https://api.discogs.com/database/search?q=Nirvana&type=artist&token=lvSqsEIAVQNHGbsYiVRDSUwSZHidyBUKGTFdZKYb"
