pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('DOCKER_USERNAME')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        EC2_PUBLIC_IP = credentials('EC2_PUBLIC_IP')
        EC2_USER = credentials('EC2_USER')
        PRIVATE_KEY = credentials('EC2_PRIVATE_KEY')
        MONGO_URI = credentials('MONGO_URI')
        AWS_REGION = credentials('AWS_REGION')
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    stages {
        stage('Checkout code') {
            steps {
                git credentialsId: 'Github', url: 'https://github.com/ayushpratapsingh1/BookStore.git'
            }
        }

        stage('Log in to Docker Hub') {
            steps {
                script {
                    sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                }
            }
        }

        stage('Build and Push Server Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_USERNAME}/backend:latest ./Backend"
                    sh "docker push ${DOCKER_USERNAME}/backend:latest"
                }
            }
        }

        stage('Upload docker-compose.yml to EC2') {
            steps {
                script {
                    sh """
                    scp -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_PUBLIC_IP}:/home/${EC2_USER}/Bookstore/
                    """
                }
            }
        }
        stage('Debug') {
            steps {
                sh 'echo "EC2_USER is $EC2_USER"'
            }
        }
        stage('Deploy to EC2') {
            steps {
                script {
                    sh """
                    ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_PUBLIC_IP} << EOF
                    cd /home/${EC2_USER}/Bookstore/
                    export DOCKER_USERNAME=${DOCKER_USERNAME}
                    export AWS_REGION=${AWS_REGION}
                    export MONGO_URI=${MONGO_URI}
                    export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                    export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

                    docker-compose down
                    docker rmi ${DOCKER_USERNAME}/backend:latest
                    docker system prune -af
                    docker-compose pull
                    docker-compose up -d --force-recreate
                    EOF
                    """
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
