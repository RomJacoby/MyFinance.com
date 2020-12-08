// Define backend's routes to test
def api_routes = ["get_all_stocks","get_all_indices"]
def abort = false
def backend_container_id = ""
def frontend_container_id = ""

pipeline {
    environment {
        image_name = ["frontend" : "myfinance_frontend:${env.BUILD_ID}" , "backend" : "myfinance_backend:${env.BUILD_ID}"]
        dockerfile = ["frontend" : "./app/react-frontend/Dockerfile-Frontend" , "backend" : "./app/Dockerfile-Backend"]
        dockerfile_context = ["frontend" : "./app/react-frontend/" , "backend" : "./app/"]    
    }

    agent any

    stages {
        stage("Build backend image") {
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
                    if (image_built == false)
                    {
                        echo 'Could not build Backend image, ABORT pipeline'
                        abort = true
                        currentBuild.result = 'ABORTED'
                        error('Aborting...')
                    }
                }
            }
        }

    }
}