pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('DOCKER_USERNAME')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        EC2_PUBLIC_IP = credentials('EC2_PUBLIC_IP')
        EC2_USER = credentials('EC2_USER')
        MONGO_URI = credentials('MONGO_URI')
        AWS_REGION = credentials('AWS_REGION')
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    stages {
        stage('Checkout code') {
            steps {
                git branch: 'main', credentialsId: 'Github', url: 'https://github.com/ayushpratapsingh1/BookStore.git'
            }
        }

        stage('Log in to Docker Hub') {
            steps {
                script {
                    bat "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin" //using bat instead of sh for Windows compatibility
                }
            }
        }

        stage('Build and Push Server Image') {
            steps {
                script {
                    bat "docker build -t ${DOCKER_USERNAME}/backend:latest ./Backend"
                    bat "docker push ${DOCKER_USERNAME}/backend:latest"
                }
            }
        }

        stage('Upload docker-compose.yml to EC2') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'EC2_PRIVATE_KEY', variable: 'KEY_FILE')]) {
                        bat """
                        powershell -Command "scp -i '%KEY_FILE%' -o StrictHostKeyChecking=no docker-compose.yml %EC2_USER%@%EC2_PUBLIC_IP%:/home/%EC2_USER%/Bookstore/"
                        """
                    }
                }
            }
        }
        stage('Debug') {
            steps {
                bat 'echo "EC2_USER is $EC2_USER"'
            }
        }
        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'EC2_PRIVATE_KEY', variable: 'KEY_FILE')]) {
                        bat """
                        powershell -Command "ssh -i '%KEY_FILE%' -o StrictHostKeyChecking=no %EC2_USER%@%EC2_PUBLIC_IP% \\"cd /home/%EC2_USER%/Bookstore; `
                            \$env:DOCKER_USERNAME='%DOCKER_USERNAME%'; `
                            \$env:MONGO_URI='%MONGO_URI%'; `
                            \$env:AWS_REGION='%AWS_REGION%'; `
                            \$env:AWS_ACCESS_KEY_ID='%AWS_ACCESS_KEY_ID%'; `
                            \$env:AWS_SECRET_ACCESS_KEY='%AWS_SECRET_ACCESS_KEY%'; `
                            docker-compose down; `
                            docker rmi %DOCKER_USERNAME%/backend:latest; `
                            docker system prune -af; `
                            docker-compose pull; `
                            docker-compose up -d --force-recreate\\""
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            node('master') {
                cleanWs()
            }
        }
    }
}
// Jenkins run locally and it runs command locally because it considers itself as a agent node locally. 
// and we are not connecting to ec2 So, we need to run the command on the agent node that is local 
// for ec2 we need to do ssh for running jenkins on it and running it there as an agent.
// We are storing Key file in secret file and then using it in script