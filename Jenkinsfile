def api_routes = ["get_all_stocks","get_all_indices"]
def backend_container_id = ""
def frontend_container_id = ""
def image_name = ["frontend" : "myfinance_frontend:${env.BUILD_ID}" , "backend" : "myfinance_backend:${env.BUILD_ID}"]
def dockerfile = ["frontend" : "./app/react-frontend/Dockerfile-Frontend" , "backend" : "./app/Dockerfile-Backend"]
def dockerfile_context = ["frontend" : "./app/react-frontend/" , "backend" : "./app/"]
def feature_build_id = Jenkins.instance.getItem('MyFinance.com').getItem('CI-CD Pipeline').getItem('feature').lastSuccessfulBuild.number

pipeline {
    environment {
        abort = false
        PROJECT_ID = 'esoteric-sled-295417'
        CLUSTER_NAME = 'cluster-1'
        ZONE = 'us-central1-c'
        MANIFEST_PATTERN = './gke/website-deployment.yaml'
        GCP_CREDENTIALS_ID = 'Finance Project'
    }

    agent any

    stages {
        stage("Build image - Backend ") {
            when {
	            allOf {
                    branch 'feature'
                    expression {abort != true}
                }  
	        }
            steps {
                script {
                    docker.build(image_name["backend"] , "-f ${dockerfile['backend']} ${dockerfile_context['backend']}")
                    output = sh(script:"docker images ${image_name['backend']}",returnStdout:true)
                    image_built = output.contains("myfinance_backend")
                    if ( image_built == false )
                    {
                        echo 'Could not build Backend image, ABORT pipeline'
                        abort = true
                        currentBuild.result = 'ABORTED'
                        error('Aborting...')
                    }
                }
            }
        }
        stage ('Build image - Frontend') {
            when {
                allOf {
                      branch 'feature'
                      expression {abort != true}
                }  
            } 
            steps {
                script {
                    docker.build(image_name["frontend"], "-f ${dockerfile['frontend']} ${dockerfile_context['frontend']}")
                    output = sh(script:"docker images ${image_name['frontend']}",returnStdout:true)
                    image_built = output.contains("myfinance_frontend")
                    if (image_built == false)
                    {
                        echo 'Could not build Frontend image, ABORT pipeline'
                        abort = true
                        currentBuild.result = 'ABORTED'
                        error('Aborting...')
                    }
                }
            }
        }
        stage('Test - Backend') {
            when {
	            allOf {
                    branch 'feature'
                    expression {abort != true}
                }  
	        }
            steps {
                script {
                    backend_container_id = sh(script:"docker run -d --rm -p 5000:5000 ${image_name['backend']}",returnStdout:true)
                    backend_container_status = sh(script:"docker inspect ${backend_container_id}",returnStdout:true)
                    if (backend_container_status.contains("running"))
                    {
                        sleep(7)
                        for (route in api_routes)
                        {
                            try
                            {
                                url = 'http://localhost:5000/' + route
                                response = httpRequest url
                            } 
                            catch (Exception e)
                            {
                                echo "Could not send GET request to ${url}, ABORT pipeline"
                                abort = true
                                currentBuild.result = 'ABORTED'
                                error('Aborting...')
                            }
                        }
                    }
                    else
                    {
                        echo "Container failed to run, ABORT pipeline"
                        abort = true
                        currentBuild.result = 'ABORTED'
                        error('Aborting...')
                    }
                }
            }
        }
        stage ('Test - Frontend') {
            when {
	            allOf {
                    branch 'feature'
                    expression {abort != true}
                }  
	        }
            steps {
                script {
                    frontend_container_id = sh(script:"docker run -d --rm -p 80:80 ${image_name['frontend']}",returnStdout:true)
                    frontend_container_status = sh(script:"docker inspect ${frontend_container_id}",returnStdout:true)
                    if (frontend_container_status.contains("running"))
                    {
                        sleep(7)
                        ip_address = sh(script: "curl -H 'Metadata-Flavor: Google' http://metadata/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip",returnStdout:true)
                        echo "Please enter the website http://${ip_address}:80 and test it"
                        input("After the tests, choose whether you want to PROCEED or ABORT the pipeline")
                    }
                    else 
                    {
                        echo "Container failed to run, ABORT pipeline"
                        abort = true
                        currentBuild.result = 'ABORTED'
                        error('Aborting...')
                    }
                }
            }    
        }
        stage('Tag latest docker images') {
            when {
                allOf {
                    branch 'feature'
                    expression {abort != true}
                }
            }
            steps{

                sh "docker tag ${image_name["frontend"]} romjacoby/myfinance_frontend_${env.BUILD_ID}"
                sh "docker tag ${image_name["backend"]} romjacoby/myfinance_backend_${env.BUILD_ID}" 
            }
        }
        stage('Push images to dockerhub') {
            when {
                allOf {
                    branch 'feature'
                    expression {abort != true}
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]){
                    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    sh "docker push romjacoby/myfinance_frontend_${env.BUILD_ID}"
                    sh "docker push romjacoby/myfinance_backend_${env.BUILD_ID}"
                }
            } 
        }
        stage('Push code to Master branch') {
            when {
                allOf {
                    branch 'feature'
                    expression {abort != true}
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'b09400db-9f0b-4de4-bb24-1f06515eb59a', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                            sh 'git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/RomJacoby/MyFinance.com HEAD:master'
                }
            }
        }
        stage('Update k8s manifest'){
            when {
                branch 'master'
            }
            steps{
                sh "sed -i s#BACKEND_IMAGE#romjacoby/myfinance_backend_${feature_build_id}#g ./gke/website-deployment.yaml"
                sh "sed -i s#FRONTEND_IMAGE#romjacoby/myfinance_frontend_${feature_build_id}#g ./gke/website-deployment.yaml"
            }
        }
        stage('Deploy to GKE'){
            when {
                branch 'master'
            }
            steps{
                step([$class: 'KubernetesEngineBuilder', 
                        projectId: env.PROJECT_ID,
                        clusterName: env.CLUSTER_NAME,
                        zone: env.ZONE,
                        manifestPattern: env.MANIFEST_PATTERN,
                        credentialsId: env.GCP_CREDENTIALS_ID]) 
            }
        }
        stage('Test GKE deployment'){
            when {
                branch 'master'
            }
            steps{
                sleep(10)
                for (route in api_routes)
                {
                    try
                    {
                        url = 'http://34.123.148.128:5000/' + route
                        response = httpRequest url
                    } 
                    catch (Exception e)
                    {
                        echo "Could not send GET request to ${url}!"
                        echo "Please visit http://34.123.148.128:80, and decide whether you want to roll back the deployment or not."
                        abort = true
                        currentBuild.result = 'ABORTED'
                        error('Aborting...')
                    }
                }    
            }
        }
    }
    post {
        always{
            script{
               if (env.BRANCH_NAME == 'feature')
               {
                   sh "docker kill ${backend_container_id}"
                   sh "docker kill ${frontend_container_id}"
               }
            }
        }
        success{
            script{
               if (env.BRANCH_NAME == 'feature')
               {
                   sh "docker rmi -f ${image_name['backend']}"
                   sh "docker rmi -f ${image_name['frontend']}"
               }
               else if ( env.BRANCH_NAME == 'master' )
               {
                   echo 'Website deployed successfully to GKE!'
                   echo 'Please visit http://34.123.148.128:80 in order to see it'
               }
            }
        }       
    }
}
