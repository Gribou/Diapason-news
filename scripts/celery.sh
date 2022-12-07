#!/bin/bash

celery -A app purge || true # ignore error
celery -A app beat --loglevel=INFO &
celery -A app worker -E --loglevel=INFO -Q ${CELERY_QUEUE:-enews}
