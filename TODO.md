# TO-DO:

1. Sort out TypeScript / Prettier errors
2. Add pagination to records and artists pages
3. Add Prettier pre-commit hook
4. Add ES/TS Lint?
5. Add tests
6. Remove "genre" field from "Records" collection API response (o)
7. Add button in the CMS to automatically pull Record and Artist data from music API
8. Get auth working
9. Add "tracklist" + "about this track" functionality
10. Need unique slugs in case records/artists happen to have same name
11. Setup tailwind config properly (add all colors, font, etc.)
12. Add data and src/media back to .gitignore files
13. Show thumbnail image in CMS List view for Records and Artists

# LOOK INTO:

1. had to `yarn install` locally to stop errors (... or maybe just had to restart VSCode?)
2. why do I have to use `sudo` before `yarn` commands?
   1. also have to delete `"credsStore": "desktop"` from ~/.docker/config.json
3. Payload "Local API"
4. Possible to seed DB with initial test/dev data?
5. Cloudinary plugin

# Deploy Process Notes

- had to geneate new SSH keys within the droplet with `sudo ssh-keygen`
- copied the new public key to Github
- manually cloned the repo to the droplet with `git clone`
- install node on the droplet with `sudo apt update` && `sudo apt install nodejs`
- install npm on the droplet with `sudo apt install npm`
- install yarn on the droplet with `sudo npm install -g yarn`

curl "https://api.discogs.com/database/search?q=Nirvana&type=artist&token=lvSqsEIAVQNHGbsYiVRDSUwSZHidyBUKGTFdZKYb"
