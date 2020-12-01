pipeline {
    agent any

    stages {
        stage('Build image for test') {
            when {
	        branch 'feature'
	    }
	    steps {
                echo 'Building for test'
            }
        }
        stage('Test') {
            when {
                branch 'feature'
            }
            steps {
                echo 'Testing..'
            }
        }
	stage('Build image for deploy') {
            when {
                branch 'master'
            }
            steps {
                echo 'Building for deploy'
            }
        }
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                echo 'Deploying....'
            }
        }
    }
}
