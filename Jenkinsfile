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
                script {
                    withCredentials([string(credentialsId: 'EC2_PRIVATE_KEY_STRING', variable: 'PEM_CONTENT')]) {
                        powershell """
                            Write-Host 'Creating PEM file...'
                            \$pemPath = "deploy.pem"
                            \$PEM_CONTENT = \$env:PEM_CONTENT -replace "`r`n", "`n"
                            \$PEM_CONTENT | Out-File -FilePath \$pemPath -Encoding ascii

                            Write-Host 'Fixing PEM file permissions...'
                            icacls \$pemPath /inheritance:r /grant:r "$env:USERNAME:F"

                            Write-Host 'Uploading docker-compose.yml to EC2...'
                            scp -i \$pemPath -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_PUBLIC_IP}:/home/${EC2_USER}/Bookstore/

                            Write-Host 'Saving PEM path to temp file for next stage...'
                            "\$pwd\\\$pemPath" | Out-File pem_path.txt
                        """
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'EC2_PRIVATE_KEY_STRING', variable: 'PEM_CONTENT')]) {
                        powershell """
                            Write-Host 'Creating PEM file again for SSH...'
                            \$pemPath = "deploy.pem"
                            \$PEM_CONTENT = \$env:PEM_CONTENT -replace "`r`n", "`n"
                            \$PEM_CONTENT | Out-File -FilePath \$pemPath -Encoding ascii

                            icacls \$pemPath /inheritance:r /grant:r "$env:USERNAME:F"

                            Write-Host 'Connecting to EC2...'
                            ssh -i \$pemPath -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_PUBLIC_IP} "
                                cd /home/${EC2_USER}/Bookstore &&
                                export DOCKER_USERNAME=${DOCKER_USERNAME} &&
                                export AWS_REGION=${AWS_REGION} &&
                                export MONGO_URI='${MONGO_URI}' &&
                                export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} &&
                                export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} &&

                                docker-compose down &&
                                docker rmi ${DOCKER_USERNAME}/backend:latest &&
                                docker system prune -af &&
                                docker-compose pull &&
                                docker-compose up -d --force-recreate
                            "

                            Write-Host 'Cleaning up PEM...'
                            Remove-Item \$pemPath
                        """
                    }
                }
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
