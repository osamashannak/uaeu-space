PROJECT_ID=my-gcp-project
REGION=me-west1

run:
	@echo "Running $(service) locally..."
	go run ./cmd/$(service)

build:
	@echo "Building Docker image for $(service)..."
	docker build -t $(service):dev -f Dockerfile.$(service) .

deploy:
	@echo "Deploying $(service) to Cloud Run..."
	gcloud builds submit --tag gcr.io/$(PROJECT_ID)/$(service) -f Dockerfile.$(service)
	gcloud run deploy $(service) \
		--image gcr.io/$(PROJECT_ID)/$(service) \
		--region $(REGION) \
		--platform managed \
		--execution-environment gen1 \
		--allow-unauthenticated

local-docker:
	@echo "Running $(service) Docker container locally..."
	docker run -p 8080:8080 --env-file=.env.$(service) $(service):dev
