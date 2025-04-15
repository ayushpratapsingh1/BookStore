pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('DOCKER_USERNAME')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
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
                    bat "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
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
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'EC2_SSH', // this must match the name you configured in "Publish over SSH"
                        transfers: [
                            sshTransfer(
                                sourceFiles: 'docker-compose.yml',
                                remoteDirectory: 'Bookstore', // this will go to /home/ec2-user/Bookstore
                                removePrefix: '',
                                execCommand: '', // no need to run commands now
                                execTimeout: 120000
                            )
                        ],
                        usePromotionTimestamp: false,
                        verbose: true
                    )
                ])
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'EC2_SSH',
                        transfers: [
                            sshTransfer(
                                execCommand: '''
                                    cd Bookstore &&
                                    export DOCKER_USERNAME=${DOCKER_USERNAME} &&
                                    export AWS_REGION=${AWS_REGION} &&
                                    export MONGO_URI='${MONGO_URI}' &&
                                    export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} &&
                                    export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} &&

                                    docker-compose down &&
                                    docker rmi ${DOCKER_USERNAME}/backend:latest || true &&
                                    docker system prune -af &&
                                    docker-compose pull &&
                                    docker-compose up -d --force-recreate
                                ''',
                                execTimeout: 120000
                            )
                        ],
                        usePromotionTimestamp: false,
                        verbose: true
                    )
                ])
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}
