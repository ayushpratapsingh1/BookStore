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
                    // Using withCredentials for secure handling of private key file
                    withCredentials([file(credentialsId: 'EC2_PRIVATE_KEY', variable: 'KEY_FILE')]) {
                    bat """
                        echo Fixing PEM file permissions...
                        icacls "%KEY_FILE%" /inheritance:r /grant:r "%USERNAME%:F"

                        echo Uploading docker-compose.yml to EC2...
                        scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_PUBLIC_IP}:/home/${EC2_USER}/Bookstore/
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
                            ssh -i %KEY_FILE% -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_PUBLIC_IP} << EOF
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

/*
Key Points:
1. **Using `withCredentials`**: This securely manages the private key by making it available during the pipeline execution. The file is stored temporarily in a secure location and passed to the pipeline using the `file` type credential.
2. **Permissions issue**: One challenge is ensuring the correct file permissions for the private key (`.pem`). Jenkins might not have access to it if the permissions are too open, causing an error. Using `withCredentials` ensures it is handled properly.
3. **Windows Compatibility**: The commands (`scp` and `ssh`) are executed using `bat` instead of `sh` because you're working in a Windows environment.
4. **Avoid Hardcoding File Paths**: By using `withCredentials`, the file path is dynamically handled, avoiding issues like hardcoding `.pem` file paths which are not flexible and can lead to errors in different environments.
5. **CI/CD flow**: The flow includes code checkout, Docker image build and push, file upload to EC2, and deployment to EC2, allowing for a seamless automated deployment pipeline.
6. **Debugging**: The debug stage is useful to confirm the variables are correctly passed (like `EC2_USER`), which can help identify issues early in the process.

Challenges:
1. **File Permissions on Windows**: One of the challenges is ensuring the private key has the right permissions. Windows has more strict security controls compared to Linux, so it's crucial to handle permissions correctly.
2. **Handling Secrets**: Another challenge is securely handling sensitive information like the private key and AWS credentials. The pipeline uses Jenkins' built-in secret management features (`credentials`) to avoid exposing sensitive data in the pipeline.
3. **Cross-Platform Compatibility**: Since the commands (`scp`, `ssh`) are typically used on Unix-based systems, ensuring they work on Windows without issues is another challenge that required using `bat` for Windows compatibility.

This setup should be secure and avoid the common pitfalls of improper private key handling while deploying applications to EC2.
*/
