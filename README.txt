The workflow goes like this:
I used a Jenkins Multi-Branch Pipeline in order to detect new changes in the repository (via a Github-Webhook), 
it retrieves a Jenkinsfile from the SCM, which its content in simple words is -
Check whether the pushed branch name is "feature" > Build backend & frontend docker images and run tests against them > Tests completed successfully? >
Trigger a push to Master > Pipeline detects that another event has occured, and retrieves Jenkinsfile again (but now from Master) >
Check whether the branch name is Master > Deploy new website images to GKE > Run tests against GKE > Tests fail? > Roll back k8s deployment.
With GKE, I also deployed a NFS server/pv/pvc/service in order to replicate the DB data between the multiple pods.
I made the website's deployment accessible via a K8s Load-Balancer service.
The End.