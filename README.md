# multi-cluster-ingress-demo

This repository contains an Express Node.js microservices "where am i" demo application for interfacing with Multi-Cluster Ingress and Gateway feature for load balancing across regional GKE clusters on Google Cloud.

## How to setup

1. Build the container image with the supplied Dockerfile.

2. Create and setup your GCP project.

3. Create multiple GKE clusters, register the GKE clusters with the Anthos Fleet and setup Multi-Cluster Service and Ingress using the instructions - https://cloud.google.com/kubernetes-engine/docs/how-to/multi-cluster-services.

4. Deploy the application with the sample YAML manifests in kubernetes-manifests directory in this repo.

