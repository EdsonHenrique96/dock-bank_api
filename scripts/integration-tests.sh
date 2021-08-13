#!/bin/bash

CMD="yarn && yarn test:integration" docker-compose -f docker-compose.dev.yaml -p integration-tests up --abort-on-container-exit