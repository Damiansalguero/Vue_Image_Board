 S3 steps.

1. register new account. provide credit card credentials
2. click on "services." under "storage" click "S3"
3. click "create bucket"

   - bucket is where our images will be stored
4. enter a unique name. choose US East (N. Virginia) as your region. Click next. Click next again.
5. You should be on the "(3) Set permissions" page.
   - **untick** all the boxes! We want our bucket to be public
   - ignore "Manage system preferences"
6. create your bucket and write down the name of your bucket
7. go back to "services", and under "Security, Identity & Compliance" click "IAM" (Identity and Access Management)
8. on the left, click "groups". provide a group name (can be anything) and click "next step"
9. now scroll and tick the box next to "AmazonS3FullAccess"
10. click next and create group
11. now on the left click on "users." click "add user"
12. enter a username (can be anything) and tick "**Programmatic access**"
13. add this user to the group created earlier. click next. click next again. click "create user"
14. **you will only be shown these credentials once. copy the credentials and store them in a secrets.json right now!**
15. 15. you're done! yay!