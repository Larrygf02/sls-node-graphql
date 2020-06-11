## Test local
sls invoke local -f query_graphql --path ./mock

## Deploy
sls deploy --aws-profile serverless-admin

## Deploy individual function
sls deploy -f query_graphql --aws-profile serverless-admin