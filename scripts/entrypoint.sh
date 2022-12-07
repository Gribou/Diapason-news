#!/bin/bash

gunicorn app.wsgi:application --bind 0.0.0.0:${WEB_PORT:-8000} --access-logfile '-' --error-logfile '-' --log-level 'info' --logger-class app.gunicorn.CustomGunicornLogger

