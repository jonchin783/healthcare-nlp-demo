# Google Healthcare Natural Language API demo on Kubernetes

This repository contains a Node.js microservices application for interfacing with Google Cloud Healthcare API designed to work on Google Kubernetes Engine (GKE), Anthos or other Kubernetes environments. Cloud Healthcare API (https://cloud.google.com/healthcare) provides a pathway to intelligent analytics and machine learning capabilities in Google Cloud with pre-built connectors for streaming data processing in Dataflow, scalable analytics with BigQuery, and machine learning with Vertex AI.

Special mention and thanks go to asrivas@ and zackAkil@ for contributing to an earlier version of a healthcare demo app based on Cloud Health API (https://github.com/GoogleCloudPlatform/healthcare-nlp-visualizer-demo).

## How to setup

1. You need a Google Cloud project with Healthcare Natural Language API and Billing enabled for your project. Currently, the Healthcare Natural Language API is available in locations us-central1 and europe-west4. Note down the Healthcare Natural Language API endpoint URL which we will need later when setting up your Kubernetes environment. The endpoint URL is in the format below. Replace "PROJECT ID" with your GCP project ID and "LOCATION" with either us-central1 or europe-west4.

   "https://healthcare.googleapis.com/v1beta1/projects/PROJECT_ID/locations/LOCATION/services/nlp:analyzeEntities"
   
   
2. Create a service account in your project which will be used for authentication. The service account needs to have role "healthcare.nlpServiceViewer" associated with it. Here is an example to do this in gcloud command line:

### 
    gcloud projects add-iam-policy-binding PROJECT_ID \
        --member serviceAccount:SERVICE_ACCOUNT_ID \
        --role roles/healthcare.nlpServiceViewer
    
3. Download the JSON key from your service account. You will need this key later when setting up your Kubernetes environment.
4. Prepare your Kubernetes cluster for hosting the application. You can use GKE, Anthos or any other Kubernetes environment. If GKE, a zonal cluster with two worker nodes of machine-type n1-standard-2 is good enough for running this demo application.
5. Once your cluster is ready, create a new namespace named "healthcare", e.g.

### 
    kubectl create ns healthcare
    
6. Create a secret with your JSON key (named "healthcare-nlp.json" in my example) in step (3), e.g. 

### 
    kubectl create secret generic gcp-nlp-serviceaccount --from-file=./healthcare-nlp.json -n healthcare

7. Create a configmap to setup environment variables to be used by the application. There are two variables required - "PORT" for exposing the internal port of the application on your cluster, and "GCP_HEALTHCARE_API" for your URL endpoint in step (1). Here's my example - 

### 
    kubectl create configmap gcp-nlp-config -n healthcare --from-literal=GCP_HEALTHCARE_API=https://healthcare.googleapis.com/v1beta1/projects/PROJECT ID /locations/LOCATION/services/nlp:analyzeEntities --from-literal=PORT=9000

8. Next, clone this repository and build your container with the Dockerfile I have provided and host it on your private docker repository. Alternatively, you can choose to use my container image - gcr.io/jonchin-gps-argolis/healthcare-demo:v1.
9. Create a deployment and service on your cluster for the app, for example:

### sample kubernetes deployment manifest

    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: healthcare-demo
      name: healthcare-demo
      namespace: healthcare
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: healthcare-demo
      strategy:
        rollingUpdate:
          maxSurge: 25%
          maxUnavailable: 25%
        type: RollingUpdate
      template:
        metadata:
          labels:
            app: healthcare-demo
        spec:
          containers:
          - image: < replace this with your container image path >
            imagePullPolicy: IfNotPresent
            name: healthcare-demo
            env:
              - name: PORT
                valueFrom:
                  configMapKeyRef:
                    name: gcp-nlp-config
                    key: PORT
              - name: GCP_HEALTHCARE_API
                valueFrom:
                  configMapKeyRef:
                    name: gcp-nlp-config
                    key: GCP_HEALTHCARE_API
            volumeMounts:
            - name: gcp-serviceaccount
              mountPath: "/tmp"
              readOnly: true
          volumes:
          - name: gcp-serviceaccount
            secret:
              secretName: gcp-nlp-serviceaccount

           
### sample kubernetes service manifest

    apiVersion: v1
    kind: Service
    metadata:
      labels:
        app: healthcare-demo
      name: healthcare-demo
      namespace: healthcare
    spec:
      ports:
      - port: 80
        protocol: TCP
        targetPort: 9000
      selector:
        app: healthcare-demo
      sessionAffinity: None
      type: LoadBalancer

## Running the application

Once your deployment is ready and your pod is running, check the Load Balancer IP address exposed by your service. Browse to the application with http://<load balancer IP address>. The current version of the application does not have a backend user database setup with it yet, click login button without any username or password to login.
  

   ![screencast](/assets/images/healthcare-app-screenshot-1.png)
  
In the main screen, enter or paste your medical or heatlh report text into the document content text field, then click on the button "Analyze" near the top right.
   
   ![screencast](/assets/images/healthcare-app-screenshot-2.png)
   
The Healthcare Natural Language API uses context-aware models to extract medical entities, relations, and contextual attributes. Each text entity is extracted into a medical dictionary entry. If the request is successful, the response includes the following information:

- Recognized medical knowledge entities
- Functional features
- Relations between the recognized entities
- Contextual attributes
- Mappings of the medical knowledge entities into standard terminologies
   
Sample output:
   
   ![screencast](/assets/images/healthcare-app-screenshot-3.png)

## Future versions of this application
   
- user/patient database store, authenticated logins.
- storing of analyzed medical report onto on-premise persistent datastore in kubernetes
