FROM alpine:3.20

# Install Ansible and OpenSSH dependencies
RUN apk add --no-cache \
    ansible \
    openssh-client \
    sshpass \
    python3 \
    py3-pip

# Set working directory for your playbooks
WORKDIR /ansible

# Default command keeps the container alive if started via compose
CMD ["tail", "-f", "/dev/null"]
