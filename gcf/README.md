#deploy the function - helloHttp is the functions name
gcloud functions deploy email --runtime nodejs8 --trigger-http --allow-unauthenticated

#get the http trigger
gcloud functions describe email

#view logs
gcloud functions logs read email

# set env variable with the send grid api key
gcloud functions deploy email --set-env-vars SENDGRID_API_KEY=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

#todos
#colocar a api key do send grid de forma segura em algum lugar...
#fazer o deploy atualizando a api key do send grid


#firebase deploy (hosting dist and functions)
firebase deploy

#deploy only functions
firebase deploy --only functions

#set env values
firebase functions:config:set service.key="value"

#get env values
firebase functions:config:get

#delete
firebase functions:config:unset service



