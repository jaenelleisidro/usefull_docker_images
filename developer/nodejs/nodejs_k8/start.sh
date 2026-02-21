# https://www.youtube.com/watch?v=8W91EwDfA3s

kubectl create deployment nodejs-node-app --image=nodejs-node-app:latest --dry-run=client -o yaml > deployment.yaml