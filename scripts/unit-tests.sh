#!/bin/bash

CMD="yarn && yarn test:unit" docker-compose -f docker-compose.node.yaml up --abort-on-container-exit