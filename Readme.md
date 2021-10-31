# build

npm run build
sam build

# Deploy

sam deploy --guided --profile faisal-development

# To watch the logs

sam logs -n LambdaThatWillReactToFileUpload --stack-name sam-lambda-trigger-s3-file-upload --tail --profile faisal-development --region ap-southeast-2
